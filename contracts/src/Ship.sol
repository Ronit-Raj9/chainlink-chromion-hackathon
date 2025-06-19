//SPDX-License-Identifier:MIT


pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from  "@chainlink/contracts/src/v0.8/ccip/libraries/Client.sol";
import {OwnerIsCreator} from "@chainlink/contracts/src/v0.8/shared/access/OwnerIsCreator.sol";
import {CCIPReceiver} from "@chainlink/contracts/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title Ship
 * @dev Individual ship contract that handles multiple tokens, CCIP transfer and automation
 * Works on both source and destination chains, uses native tokens for CCIP fees
 */
// Removed CCIPReceiver from inheritance, as this contract will no longer receive CCIP messages
// on the destination chain. It will only send.
contract Ship is OwnerIsCreator, ReentrancyGuard, AutomationCompatibleInterface {
    IRouterClient private immutable i_router;
    
    // --- NEW: Address of the ShipReceiver contract on the destination chain ---
    address public immutable destinationShipReceiver;

    // Ship parameters
    address public immutable creator;
    uint64 public immutable destinationChainSelector;
    uint8 public immutable capacity;
    uint256 public immutable createdAt;
    
    // Ship state
    uint8 public currentPassengers;
    bool public isLaunched;
    // isReceived and isDistributed are no longer needed here as the destination contract handles it
    // bool public isReceived;
    // bool public isDistributed;
    bytes32 public ccipMessageId;
    uint256 public collectedFees; // Native tokens collected for CCIP
    
    // Token tracking
    address[] public supportedTokens;
    mapping(address => bool) public isTokenSupported;
    mapping(address => uint256) public totalTokenAmounts;
    
    // Passenger data
    // Struct Passenger definition can be removed if not directly used here (it's internal to original Ship logic)
    // struct Passenger {
    //     address addr;
    //     mapping(address => uint256) tokenAmounts; // token => amount
    // }
    
    address[] public passengers;
    mapping(address => uint256) public passengerIndex;
    mapping(address => bool) public isPassenger;
    mapping(address => mapping(address => uint256)) public passengerTokenAmounts; // passenger => token => amount
    
    // Fee structure
    uint256 public constant BASE_FEE = 0.001 ether; // Base fee per passenger
    uint256 public constant TOKEN_FEE = 0.0005 ether; // Additional fee per token type
    
    // Events
    event PassengerBoarded(address indexed passenger, address[] tokens, uint256[] amounts, uint8 passengerCount);
    event ShipLaunched(bytes32 indexed messageId, address[] tokens, uint256[] totalAmounts);
    event CCIPFeePaid(uint256 feeAmount);
    // ShipReceived, TokensDistributed, DistributionCompleted are now emitted by ShipReceiver
    // event ShipReceived(bytes32 indexed messageId, address[] tokens, uint256[] totalAmounts);
    // event TokensDistributed(address indexed recipient, address[] tokens, uint256[] amounts);
    // event DistributionCompleted(bytes32 indexed messageId);
    event TokenAdded(address indexed token);
    
    // Errors
    error ShipFull();
    error AlreadyLaunched();
    error NotFull();
    error AlreadyPassenger();
    error InvalidAmount();
    error InsufficientFee();
    error CCIPTransferFailed();
    error UnauthorizedSender();
    // UnauthorizedSourceChain, AlreadyReceived, NotReceived, AlreadyDistributed are for receiver contract
    // error UnauthorizedSourceChain();
    // error AlreadyReceived();
    // error NotReceived();
    // error AlreadyDistributed();
    error TokenNotSupported();
    error InvalidTokensAndAmounts();
    error InsufficientNativeBalance();
    
    constructor(
        address _creator,
        address[] memory _initialTokens,
        uint256[] memory _initialAmounts,
        uint64 _destinationChainSelector,
        uint8 _capacity,
        address _router,
        address _destinationShipReceiver // NEW: Pass the address of the receiver contract on destination
    ) OwnerIsCreator() payable { // Removed CCIPReceiver(_router) here
        require(_initialTokens.length == _initialAmounts.length, "Arrays length mismatch");
        require(_initialTokens.length > 0, "At least one token required");
        require(_destinationShipReceiver != address(0), "Invalid destinationShipReceiver address");
        
        creator = _creator;
        destinationChainSelector = _destinationChainSelector;
        capacity = _capacity;
        createdAt = block.timestamp;
        
        i_router = IRouterClient(_router);
        destinationShipReceiver = _destinationShipReceiver; // Store the receiver address
        
        // Add supported tokens
        for (uint256 i = 0; i < _initialTokens.length; i++) {
            if (!isTokenSupported[_initialTokens[i]]) {
                supportedTokens.push(_initialTokens[i]);
                isTokenSupported[_initialTokens[i]] = true;
                emit TokenAdded(_initialTokens[i]);
            }
            totalTokenAmounts[_initialTokens[i]] += _initialAmounts[i];
            passengerTokenAmounts[_creator][_initialTokens[i]] = _initialAmounts[i];
        }
        
        // Add creator as first passenger
        passengers.push(_creator);
        passengerIndex[_creator] = 0;
        isPassenger[_creator] = true;
        currentPassengers = 1;
        
        // Collect fees from msg.value
        collectedFees = msg.value;
        
        emit PassengerBoarded(_creator, _initialTokens, _initialAmounts, 1);
    }
    
    /**
     * @dev Join this ship as a passenger with multiple tokens
     * @param _tokens Array of token addresses to contribute
     * @param _amounts Array of token amounts corresponding to tokens
     */
    function boardShip(address[] calldata _tokens, uint256[] calldata _amounts) 
        external 
        payable 
        nonReentrant 
    {
        if (currentPassengers >= capacity) revert ShipFull();
        if (isLaunched) revert AlreadyLaunched();
        if (isPassenger[msg.sender]) revert AlreadyPassenger();
        if (_tokens.length != _amounts.length) revert InvalidTokensAndAmounts();
        if (_tokens.length == 0) revert InvalidAmount();
        
        // Calculate required fee
        uint256 requiredFee = BASE_FEE;
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (!isTokenSupported[_tokens[i]]) {
                requiredFee += TOKEN_FEE; // Fee for adding new token
            }
        }
        
        if (msg.value < requiredFee) revert InsufficientFee();
        
        // Transfer tokens from passenger to this contract
        for (uint256 i = 0; i < _tokens.length; i++) {
            if (_amounts[i] == 0) revert InvalidAmount();
            
            IERC20(_tokens[i]).transferFrom(msg.sender, address(this), _amounts[i]);
            
            // Add token if not already supported
            if (!isTokenSupported[_tokens[i]]) {
                supportedTokens.push(_tokens[i]);
                isTokenSupported[_tokens[i]] = true;
                emit TokenAdded(_tokens[i]);
            }
            
            totalTokenAmounts[_tokens[i]] += _amounts[i];
            passengerTokenAmounts[msg.sender][_tokens[i]] = _amounts[i];
        }
        
        // Add passenger
        passengers.push(msg.sender);
        passengerIndex[msg.sender] = currentPassengers;
        isPassenger[msg.sender] = true;
        currentPassengers++;
        
        // Collect fees
        collectedFees += msg.value;
        
        emit PassengerBoarded(msg.sender, _tokens, _amounts, currentPassengers);
    }
    
    /**
     * @dev Calculate CCIP fee for the transfer using native tokens
     */
    function getCCIPFee() public view returns (uint256) {
        if (supportedTokens.length == 0) return 0;
        
        Client.EVM2AnyMessage memory message = _buildCCIPMessage();
        return i_router.getFee(destinationChainSelector, message);
    }
    
    /**
     * @dev Build CCIP message for multi-token transfer
     * @dev Now sends to the dedicated ShipReceiver contract address
     */
    function _buildCCIPMessage() internal view returns (Client.EVM2AnyMessage memory) {
        // Create token amounts array for all supported tokens
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](supportedTokens.length);
        
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            tokenAmounts[i] = Client.EVMTokenAmount({
                token: supportedTokens[i],
                amount: totalTokenAmounts[supportedTokens[i]]
            });
        }
        
        // Encode passenger data for destination
        bytes memory data = abi.encode(passengers, supportedTokens, _getPassengerTokenData());
        
        return Client.EVM2AnyMessage({
            // NEW: Receiver is the dedicated ShipReceiver contract address
            receiver: abi.encode(destinationShipReceiver), 
            data: data,
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 500_000}) // Ensure enough gas for receiver logic
            ),
            feeToken: address(0) // Use native tokens for fees
        });
    }
    
    /**
     * @dev Get passenger token data for encoding
     */
    function _getPassengerTokenData() internal view returns (uint256[][] memory) {
        uint256[][] memory passengerTokenData = new uint256[][](passengers.length);
        
        for (uint256 i = 0; i < passengers.length; i++) {
            passengerTokenData[i] = new uint256[](supportedTokens.length);
            for (uint256 j = 0; j < supportedTokens.length; j++) {
                passengerTokenData[i][j] = passengerTokenAmounts[passengers[i]][supportedTokens[j]];
            }
        }
        
        return passengerTokenData;
    }
    
    /**
     * @dev Launch the ship via CCIP using native tokens for fees
     */
    function launchShip() public nonReentrant {
        if (currentPassengers != capacity) revert NotFull();
        if (isLaunched) revert AlreadyLaunched();
        
        uint256 ccipFee = getCCIPFee();
        if (collectedFees < ccipFee) revert InsufficientFee();
        
        // Approve tokens for CCIP router
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            IERC20(supportedTokens[i]).approve(address(i_router), totalTokenAmounts[supportedTokens[i]]);
        }
        
        // Build and send CCIP message
        Client.EVM2AnyMessage memory message = _buildCCIPMessage();
        
        try i_router.ccipSend{value: ccipFee}(destinationChainSelector, message) returns (bytes32 messageId) {
            ccipMessageId = messageId;
            isLaunched = true;
            collectedFees -= ccipFee; // Deduct used fee
            
            // Create arrays for event
            uint256[] memory totalAmounts = new uint256[](supportedTokens.length);
            for (uint256 i = 0; i < supportedTokens.length; i++) {
                totalAmounts[i] = totalTokenAmounts[supportedTokens[i]];
            }
            
            emit ShipLaunched(messageId, supportedTokens, totalAmounts);
            emit CCIPFeePaid(ccipFee);
        } catch {
            // Revert approvals on failure
            for (uint256 i = 0; i < supportedTokens.length; i++) {
                IERC20(supportedTokens[i]).approve(address(i_router), 0);
            }
            revert CCIPTransferFailed();
        }
    }
    
    // _ccipReceive function removed from here as it's now in ShipReceiver
    // function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override 
    // { ... }
    
    // _distributeTokens function removed from here as it's now in ShipReceiver
    // function _distributeTokens() internal { ... }

    
    /**
     * @dev Chainlink Automation compatibility
     */
    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (currentPassengers == capacity) && 
                      !isLaunched && 
                      (collectedFees >= getCCIPFee());
        performData = "";
    }
    
    function performUpkeep(bytes calldata) external override {
        if (currentPassengers == capacity && !isLaunched && collectedFees >= getCCIPFee()) {
            launchShip();
        }
    }
    
    /**
     * @dev Get passenger's token amounts
     */
    function getPassengerTokenAmounts(address _passenger, address _token) 
        external 
        view 
        returns (uint256) 
    {
        return passengerTokenAmounts[_passenger][_token];
    }
    
    /**
     * @dev Get all supported tokens
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }
    
    /**
     * @dev Get ship status including destination chain info
     */
    function getShipStatus() external view returns (
        uint8 _currentPassengers,
        uint8 _capacity,
        uint256 _collectedFees,
        bool _isLaunched,
        // Removed receiver-side flags from this contract's status
        // bool _isReceived, 
        // bool _isDistributed,
        bytes32 _ccipMessageId,
        uint256 _ccipFee,
        uint256 _tokenCount
    ) {
        return (
            currentPassengers,
            capacity,
            collectedFees,
            isLaunched,
            // _isReceived,
            // _isDistributed,
            ccipMessageId,
            getCCIPFee(),
            supportedTokens.length
        );
    }
    
    /**
     * @dev Setup allowlists for destination chain (only owner/creator)
     */
 
    /**
     * @dev Withdraw excess fees (only creator after launch or owner)
     */
    function withdrawExcessFees() external {
        require(msg.sender == creator || msg.sender == owner(), "Unauthorized");
        require(isLaunched || msg.sender == owner(), "Ship not launched");
        
        uint256 amount = collectedFees;
        if (amount > 0) {
            collectedFees = 0;
            payable(msg.sender).transfer(amount);
        }
    }
    
    /**
     * @dev Emergency function to recover stuck tokens (only creator/owner)
     */
    function emergencyWithdraw(address _token) external {
        require(msg.sender == creator || msg.sender == owner(), "Unauthorized");
        // Simplified condition as this contract is no longer the receiver
        require(!isLaunched, "Ship in transit"); 
        
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if (balance > 0) {
            IERC20(_token).transfer(msg.sender, balance);
        }
    }
    
    receive() external payable {
        collectedFees += msg.value;
    }
}

