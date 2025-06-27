// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {ShipFactory} from "../src/ShipFactory.sol";

/**
 * @title DeployShipFactory
 * @dev Deploys the ShipFactory contract.
 * Takes a router address as an argument.
 */
contract DeployShipFactory is Script {
    function run(address routerAddress) public {
        vm.startBroadcast();
        
        // Deploy ShipFactory
        ShipFactory shipFactory = new ShipFactory(routerAddress);
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("=== ShipFactory Deployment ===");
        console.log("Router Address:", routerAddress);
        console.log("ShipFactory Address:", address(shipFactory));
        console.log("Deployer:", msg.sender);
        
        // Verify capacity fees
        console.log("\n=== Capacity Fees ===");
        console.log("Capacity 1:", shipFactory.getCapacityFee(1));
        console.log("Capacity 2:", shipFactory.getCapacityFee(2));
        console.log("Capacity 5:", shipFactory.getCapacityFee(5));
        console.log("Capacity 10:", shipFactory.getCapacityFee(10));
        console.log("Token Creation Fee:", shipFactory.TOKEN_CREATION_FEE());
    }
}

