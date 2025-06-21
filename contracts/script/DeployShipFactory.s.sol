// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ShipFactory} from "../src/ShipFactory.sol";

contract DeployShipFactory is Script {
    
    function run() external {
        // Get network name from environment or use default
        // string memory network = vm.envOr("NETWORK", string("sepolia"));
        
        // // Get router address for the network
        // address routerAddress = routers[network];
        address routerAddress = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
        require(routerAddress != address(0), "Router address not found for network");
        
        // Get private key from environment
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy ShipFactory
        ShipFactory shipFactory = new ShipFactory(routerAddress);
        
        // Stop broadcasting
        vm.stopBroadcast();
        
        // Log deployment info
        console.log("=== ShipFactory Deployment ===");
        // console.log("Network:", network);
        console.log("Router Address:", routerAddress);
        console.log("ShipFactory Address:", address(shipFactory));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        
        // Verify capacity fees
        console.log("\n=== Capacity Fees ===");
        console.log("Capacity 1:", shipFactory.getCapacityFee(1));
        console.log("Capacity 2:", shipFactory.getCapacityFee(2));
        console.log("Capacity 5:", shipFactory.getCapacityFee(5));
        console.log("Capacity 10:", shipFactory.getCapacityFee(10));
        console.log("Token Creation Fee:", shipFactory.TOKEN_CREATION_FEE());
    }
}

