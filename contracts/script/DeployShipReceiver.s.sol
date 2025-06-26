// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {ShipReceiver} from "../src/ShipReceiver.sol";

contract DeployShipReceiver is Script {
    function run(address routerAddress) external {
        vm.startBroadcast();
        
        ShipReceiver shipReceiver = new ShipReceiver(routerAddress);
        
        vm.stopBroadcast();
        
        console.log("=== ShipReceiver Deployment ===");
        console.log("Router Address:", routerAddress);
        console.log("ShipReceiver Address:", address(shipReceiver));
        console.log("Deployer:", msg.sender);
    }
}

