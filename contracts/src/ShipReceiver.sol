// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {CCIPReceiver} from "@chainlink/contracts/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ShipReceiver
 * @dev This contract acts as the CCIP receiver on the destination chain.
 * It receives cross-chain messages AND tokens from the Ship contract on the source chain,
 * and then distributes the transferred tokens to the intended passengers.
 */
contract ShipReceiver is CCIPReceiver, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    address[] public receivedPassengers;
    address[] public receivedSupportedTokens;
    
    // Track tokens received via CCIP
    mapping(address => uint256) public receivedTokenAmounts;

    mapping(address => mapping(address => uint256))
        public receivedPassengerTokenAmounts;
    mapping(address => bool) public isPassengerReceived;

    bytes32 public lastReceivedMessageId;
    bool public isReceivedComplete;
    bool public isDistributionComplete;

    // Events
    event ShipDataReceived(
        bytes32 indexed messageId,
        address[] passengers,
        address[] tokens,
        uint256[] tokenAmounts
    );
    event TokensDistributedToPassenger(
        address indexed passenger,
        address[] tokens,
        uint256[] amounts
    );
    event AllTokensDistributed(bytes32 indexed messageId);
    event TokenDistributionFailed(
        address indexed passenger,
        address indexed token,
        uint256 amount,
        string reason
    );
    event DebugInfo(string message, uint256 value);

    // Errors
    error AlreadyReceived();
    error NotYetReceived();
    error DistributionAlreadyComplete();
    error InvalidIncomingData();
    error TokenMismatch();

    constructor(address _router) CCIPReceiver(_router) {}

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override nonReentrant {
        if (isReceivedComplete) revert AlreadyReceived();

        // Log debug info
        emit DebugInfo("CCIP Receive Started", any2EvmMessage.destTokenAmounts.length);

        // Handle received tokens first
        Client.EVMTokenAmount[] memory destTokenAmounts = any2EvmMessage.destTokenAmounts;
        
        emit DebugInfo("Dest Token Amounts Length", destTokenAmounts.length);

        // Try to decode the message data
        try this.decodeMessageData(any2EvmMessage.data) returns (
            address[] memory _passengers,
            address[] memory _supportedTokens,
            uint256[][] memory _passengerTokenData
        ) {
            emit DebugInfo("Decode Success - Passengers", _passengers.length);
            emit DebugInfo("Decode Success - Tokens", _supportedTokens.length);
            
            // Validate incoming data
            if (
                _passengers.length == 0 ||
                _supportedTokens.length == 0 ||
                _passengers.length != _passengerTokenData.length
            ) {
                revert InvalidIncomingData();
            }
            

            // Store received tokens - be more flexible with token matching
            for (uint256 i = 0; i < destTokenAmounts.length; i++) {
                address tokenAddress = destTokenAmounts[i].token;
                receivedSupportedTokens.push(tokenAddress);
                uint256 amount = destTokenAmounts[i].amount;
                receivedTokenAmounts[tokenAddress] = amount;
                emit DebugInfo("Received Token Amount", amount);
            }

            // Store passenger and distribution data
            receivedPassengers = _passengers;

            // Store passenger token allocations
            for (uint256 i = 0; i < _passengers.length; i++) {
                address currentPassenger = _passengers[i];
                isPassengerReceived[currentPassenger] = true;

                if (_passengerTokenData[i].length != _supportedTokens.length) {
                    revert InvalidIncomingData();
                }

                for (uint256 j = 0; j < receivedSupportedTokens.length; j++) {
                    receivedPassengerTokenAmounts[currentPassenger][
                        receivedSupportedTokens[j]
                    ] = _passengerTokenData[i][j];
                }
            }

            lastReceivedMessageId = any2EvmMessage.messageId;
            isReceivedComplete = true;

            // Create array of received amounts for event
            uint256[] memory totalReceivedAmounts = new uint256[](_supportedTokens.length);
            for (uint256 i = 0; i < _supportedTokens.length; i++) {
                totalReceivedAmounts[i] = receivedTokenAmounts[receivedSupportedTokens[i]];
            }

            emit ShipDataReceived(
                lastReceivedMessageId,
                receivedPassengers,
                receivedSupportedTokens,
                totalReceivedAmounts
            );

            // Try to distribute tokens, but don't fail the whole transaction if distribution fails
            try this.distributeTokensExternal() {
                emit DebugInfo("Distribution Success", 1);
            } catch {
                emit DebugInfo("Distribution Failed - Can Retry", 0);
                // Distribution failed, but message was received successfully
                // Can be retried manually later
            }

        } catch {
            emit DebugInfo("Decode Failed", 0);
            revert InvalidIncomingData();
        }
    }

    // External function to allow try-catch on distribution
    function distributeTokensExternal() external {
        require(msg.sender == address(this), "Internal only");
        _distributeTokens();
    }

    // Public function to decode message data (for try-catch)
    function decodeMessageData(bytes memory data) 
        external 
        pure 
        returns (
            address[] memory passengers,
            address[] memory supportedTokens,
            uint256[][] memory passengerTokenData
        ) 
    {
        return abi.decode(data, (address[], address[], uint256[][]));
    }

    function _distributeTokens() internal {
        if (!isReceivedComplete) revert NotYetReceived();
        if (isDistributionComplete) revert DistributionAlreadyComplete();

        emit DebugInfo("Distribution Started", receivedPassengers.length);

        for (uint256 i = 0; i < receivedPassengers.length; i++) {
            address passenger = receivedPassengers[i];

            // Count non-zero allocations for this passenger
            uint256 tokenCountForPassenger = 0;
            for (uint256 j = 0; j < receivedSupportedTokens.length; j++) {
                if (receivedPassengerTokenAmounts[passenger][receivedSupportedTokens[j]] > 0) {
                    tokenCountForPassenger++;
                }
            }

            if (tokenCountForPassenger == 0) continue;

            address[] memory passengerTokens = new address[](tokenCountForPassenger);
            uint256[] memory passengerAmounts = new uint256[](tokenCountForPassenger);

            uint256 index = 0;
            for (uint256 j = 0; j < receivedSupportedTokens.length; j++) {
                address currentToken = receivedSupportedTokens[j];
                uint256 amount = receivedPassengerTokenAmounts[passenger][currentToken];

                if (amount > 0) {
                    // Check contract balance
                    uint256 contractBalance = IERC20(currentToken).balanceOf(address(this));
                    
                    emit DebugInfo("Contract Balance", contractBalance);
                    emit DebugInfo("Required Amount", amount);

                    if (contractBalance < amount) {
                        emit TokenDistributionFailed(
                            passenger,
                            currentToken,
                            amount,
                            "Insufficient contract balance"
                        );
                        continue;
                    }

                    // Transfer tokens to passenger
                    try IERC20(currentToken).transfer(passenger, amount) returns (bool success) {
                        if (success) {
                            passengerTokens[index] = currentToken;
                            passengerAmounts[index] = amount;
                            index++;
                            emit DebugInfo("Transfer Success", amount);
                        } else {
                            emit TokenDistributionFailed(
                                passenger,
                                currentToken,
                                amount,
                                "Transfer returned false"
                            );
                        }
                    } catch Error(string memory reason) {
                        emit TokenDistributionFailed(
                            passenger,
                            currentToken,
                            amount,
                            reason
                        );
                    } catch {
                        emit TokenDistributionFailed(
                            passenger,
                            currentToken,
                            amount,
                            "Unknown transfer error"
                        );
                    }
                }
            }

            // Emit event for successful distributions only
            if (index > 0) {
                // Resize arrays to actual successful transfers
                address[] memory actualTokens = new address[](index);
                uint256[] memory actualAmounts = new uint256[](index);
                for (uint256 k = 0; k < index; k++) {
                    actualTokens[k] = passengerTokens[k];
                    actualAmounts[k] = passengerAmounts[k];
                }
                
                emit TokensDistributedToPassenger(
                    passenger,
                    actualTokens,
                    actualAmounts
                );
            }
        }

        isDistributionComplete = true;
        emit AllTokensDistributed(lastReceivedMessageId);
        emit DebugInfo("Distribution Completed", 1);
    }

    // Manual distribution function that can be called if automatic distribution fails
    function manualDistributeTokens() external nonReentrant {
        _distributeTokens();
    }

    // Emergency function to distribute to a specific passenger
    function emergencyDistributeToPassenger(address passenger) external nonReentrant {
        require(isReceivedComplete, "Not received yet");
        require(isPassengerReceived[passenger], "Not a passenger");

        for (uint256 j = 0; j < receivedSupportedTokens.length; j++) {
            address currentToken = receivedSupportedTokens[j];
            uint256 amount = receivedPassengerTokenAmounts[passenger][currentToken];

            if (amount > 0) {
                uint256 contractBalance = IERC20(currentToken).balanceOf(address(this));
                if (contractBalance >= amount) {
                    try IERC20(currentToken).transfer(passenger, amount) {
                        // Reset the amount to prevent double spending
                        receivedPassengerTokenAmounts[passenger][currentToken] = 0;
                    } catch {
                        emit TokenDistributionFailed(
                            passenger,
                            currentToken,
                            amount,
                            "Emergency transfer failed"
                        );
                    }
                }
            }
        }
    }

    // View functions for debugging
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    function getReceivedTokenAmount(address token) external view returns (uint256) {
        return receivedTokenAmounts[token];
    }

    function getLastReceivedMessageStatus()
        external
        view
        returns (
            bytes32 messageId,
            bool receivedComplete,
            bool distributionComplete,
            address[] memory passengers,
            address[] memory tokens
        )
    {
        return (
            lastReceivedMessageId,
            isReceivedComplete,
            isDistributionComplete,
            receivedPassengers,
            receivedSupportedTokens
        );
    }

    function getPassengerTokenAmountReceived(
        address _passenger,
        address _token
    ) external view returns (uint256) {
        return receivedPassengerTokenAmounts[_passenger][_token];
    }

    // Function to check if a passenger has been allocated tokens
    function isPassengerAllocated(address passenger) external view returns (bool) {
        return isPassengerReceived[passenger];
    }

    // Function to get all allocated passengers
    function getAllPassengers() external view returns (address[] memory) {
        return receivedPassengers;
    }

    // Function to get all received tokens
    function getAllReceivedTokens() external view returns (address[] memory) {
        return receivedSupportedTokens;
    }
}