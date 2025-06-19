// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {CCIPReceiver} from "@chainlink/contracts/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts/src/v0.8/ccip/libraries/Client.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title ShipReceiver
 * @dev This contract acts as the CCIP receiver on the destination chain.
 * It receives cross-chain messages from the Ship contract on the source chain,
 * and then distributes the transferred tokens to the intended passengers.
 */
contract ShipReceiver is CCIPReceiver, ReentrancyGuard {

    address[] public receivedPassengers;
    address[] public receivedSupportedTokens;
   
    mapping(address => mapping(address => uint256)) public receivedPassengerTokenAmounts;
    mapping(address => bool) public isPassengerReceived; 

    bytes32 public lastReceivedMessageId;
    bool public isReceivedComplete;    // Flag to indicate message processing is done
    bool public isDistributionComplete; // Flag to indicate tokens have been distributed

    // Events
    event ShipDataReceived(bytes32 indexed messageId, address[] passengers, address[] tokens);
    event TokensDistributedToPassenger(address indexed passenger, address[] tokens, uint256[] amounts);
    event AllTokensDistributed(bytes32 indexed messageId);

    // Errors
    error AlreadyReceived();
    error NotYetReceived();
    error DistributionAlreadyComplete();
    error InvalidIncomingData();

    /**
     * @dev Constructor for ShipReceiver.
     * @param _router The address of the Chainlink CCIP Router on this (destination) chain.
     */
    constructor(address _router) CCIPReceiver(_router) {
        // The CCIPReceiver base contract takes care of setting up the router.
    }

    /**
     * @dev Handles incoming CCIP messages from the source chain.
     * This function is called by the Chainlink CCIP Router.
     * It decodes the received data and triggers token distribution.
     * @param any2EvmMessage The incoming CCIP message.
     */
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override nonReentrant {
       
        if (isReceivedComplete) revert AlreadyReceived();

        
        (
            address[] memory _passengers,
            address[] memory _supportedTokens,
            uint256[][] memory _passengerTokenData
        ) = abi.decode(any2EvmMessage.data, (address[], address[], uint256[][]));

        // Basic validation of incoming data length
        if (_passengers.length == 0 || _supportedTokens.length == 0 || _passengers.length != _passengerTokenData.length) {
            revert InvalidIncomingData();
        }

        // --- Store the received data in the contract's state ---
        receivedPassengers = _passengers;
        receivedSupportedTokens = _supportedTokens;

        for (uint256 i = 0; i < _passengers.length; i++) {
            address currentPassenger = _passengers[i];
            isPassengerReceived[currentPassenger] = true;

            if (_passengerTokenData[i].length != _supportedTokens.length) {
                revert InvalidIncomingData(); // Mismatch in token data for a passenger
            }

            for (uint256 j = 0; j < _supportedTokens.length; j++) {
                receivedPassengerTokenAmounts[currentPassenger][_supportedTokens[j]] = _passengerTokenData[i][j];
            }
        }

        lastReceivedMessageId = any2EvmMessage.messageId;
        isReceivedComplete = true; // Mark as received and processed

        emit ShipDataReceived(lastReceivedMessageId, receivedPassengers, receivedSupportedTokens);

        // Automatically distribute tokens after successful reception
        // This makes the process fully automated once the message arrives
        _distributeTokens();
    }

    /**
     * @dev Internal function to distribute tokens to passengers based on received data.
     * This is called automatically by _ccipReceive.
     */
    function _distributeTokens() internal nonReentrant {
        if (!isReceivedComplete) revert NotYetReceived();
        if (isDistributionComplete) revert DistributionAlreadyComplete();

        // Iterate through all received passengers and transfer their respective tokens
        for (uint256 i = 0; i < receivedPassengers.length; i++) {
            address passenger = receivedPassengers[i];

            // Prepare arrays for this specific passenger's tokens and amounts
            // This is done to emit a clear event per passenger
            uint256 tokenCountForPassenger = 0;
            for (uint256 j = 0; j < receivedSupportedTokens.length; j++) {
                if (receivedPassengerTokenAmounts[passenger][receivedSupportedTokens[j]] > 0) {
                    tokenCountForPassenger++;
                }
            }

            address[] memory passengerTokens = new address[](tokenCountForPassenger);
            uint256[] memory passengerAmounts = new uint256[](tokenCountForPassenger);

            uint256 index = 0;
            for (uint256 j = 0; j < receivedSupportedTokens.length; j++) {
                address currentToken = receivedSupportedTokens[j];
                uint256 amount = receivedPassengerTokenAmounts[passenger][currentToken];

                if (amount > 0) {
                    // Transfer tokens to the passenger
                    IERC20(currentToken).transfer(passenger, amount);

                    // Record for event
                    passengerTokens[index] = currentToken;
                    passengerAmounts[index] = amount;
                    index++;
                }
            }

            // Emit event for each passenger's distribution
            if (tokenCountForPassenger > 0) {
                emit TokensDistributedToPassenger(passenger, passengerTokens, passengerAmounts);
            }
        }

        isDistributionComplete = true; // Mark distribution as complete
        emit AllTokensDistributed(lastReceivedMessageId);
    }

    
    // --- View Functions for checking state (useful for debugging/UI) ---

    /**
     * @dev Returns the details of the last received CCIP message.
     */
    function getLastReceivedMessageStatus() external view returns (
        bytes32 messageId,
        bool receivedComplete,
        bool distributionComplete,
        address[] memory passengers,
        address[] memory tokens
    ) {
        return (
            lastReceivedMessageId,
            isReceivedComplete,
            isDistributionComplete,
            receivedPassengers,
            receivedSupportedTokens
        );
    }

    /**
     * @dev Returns the amount of a specific token for a specific passenger from the last received message.
     * @param _passenger The address of the passenger.
     * @param _token The address of the token.
     * @return The amount of the token for the passenger.
     */
    function getPassengerTokenAmountReceived(address _passenger, address _token)
        external
        view
        returns (uint256)
    {
        return receivedPassengerTokenAmounts[_passenger][_token];
    }
}
