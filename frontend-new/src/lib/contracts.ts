export const CONTRACTS = {
  // Deployed contract addresses - UPDATED TO MATCH LATEST DEPLOYMENTS
  SHIP_FACTORY: {
    address: '0x0b990c4e9119321cfc9ee7385c97422c4bd9f66c' as const,
    chainId: 421614, // Arbitrum Sepolia
  },
  SHIP_RECEIVER: {
    address: '0x0b990c4e9119321cfc9ee7385c97422c4bd9f66c' as const, // SAME ADDRESS ON DIFFERENT CHAIN
    chainId: 11155111, // Ethereum Sepolia
  }
} as const

// Chain configurations
export const CHAIN_CONFIG = {
  421614: { // Arbitrum Sepolia
    name: 'Arbitrum Sepolia',
    icon: '🔵',
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    blockExplorer: 'https://sepolia.arbiscan.io',
    ccipChainSelector: '3478487238524512106' // Arbitrum Sepolia CCIP selector
  },
  11155111: { // Ethereum Sepolia
    name: 'Ethereum Sepolia',
    icon: '⚡',
    rpcUrl: 'https://rpc.sepolia.org',
    blockExplorer: 'https://sepolia.etherscan.io',
    ccipChainSelector: '16015286601757825753' // Ethereum Sepolia CCIP selector
  }
} as const

// UPDATED: Correct token addresses for Arbitrum Sepolia and Ethereum Sepolia
export const TEST_TOKENS = {
  421614: { // Arbitrum Sepolia
    CCIP_BnM: '0xA8C0c11bf64AF62CDCA6f93D3769B88BdD7cb93D', // Verified CCIP-BnM on Arbitrum Sepolia
    CCIP_LnM: '0x139E99f0ab4084E14e6bb7DacA289a91a2d92927', // Verified CCIP-LnM on Arbitrum Sepolia
    // Add some native token alternatives for testing
    WETH: '0x980B62Da83eFf3D4576C647993b0c1D7faf17c73', // Wrapped ETH on Arbitrum Sepolia
    USDC: '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'  // USDC on Arbitrum Sepolia
  },
  11155111: { // Ethereum Sepolia
    CCIP_BnM: '0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05', // Verified CCIP-BnM on Ethereum Sepolia
    CCIP_LnM: '0x466D489b6d36E7E3b824ef491C225F5830E81cC1', // Verified CCIP-LnM on Ethereum Sepolia
    WETH: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', // Wrapped ETH on Ethereum Sepolia
    USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'  // USDC on Ethereum Sepolia
  }
} as const

// Contract ABIs (extracted from compiled contracts)
export const SHIP_FACTORY_ABI = [
  {
    "type": "constructor",
    "inputs": [{"name": "_router", "type": "address", "internalType": "address"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "calculateCreationFee",
    "inputs": [
      {"name": "_capacity", "type": "uint8", "internalType": "uint8"},
      {"name": "_tokenCount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "createShip",
    "inputs": [
      {"name": "_tokens", "type": "address[]", "internalType": "address[]"},
      {"name": "_amounts", "type": "uint256[]", "internalType": "uint256[]"},
      {"name": "_destinationChainSelector", "type": "uint64", "internalType": "uint64"},
      {"name": "_capacity", "type": "uint8", "internalType": "uint8"},
      {"name": "_destinationShipReceiver", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "shipAddress", "type": "address", "internalType": "address"}],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "getCapacityFee",
    "inputs": [{"name": "_capacity", "type": "uint8", "internalType": "uint8"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getShip",
    "inputs": [{"name": "_shipId", "type": "uint256", "internalType": "uint256"}],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTotalShips",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserShips",
    "inputs": [{"name": "_user", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256[]", "internalType": "uint256[]"}],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "ShipCreated",
    "inputs": [
      {"name": "shipId", "type": "uint256", "indexed": true, "internalType": "uint256"},
      {"name": "creator", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "shipAddress", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "tokens", "type": "address[]", "indexed": false, "internalType": "address[]"},
      {"name": "capacity", "type": "uint8", "indexed": false, "internalType": "uint8"},
      {"name": "destinationChainSelector", "type": "uint64", "indexed": false, "internalType": "uint64"},
      {"name": "feePaid", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  }
] as const

export const SHIP_ABI = [
  {
    "type": "function",
    "name": "boardShip",
    "inputs": [
      {"name": "_tokens", "type": "address[]", "internalType": "address[]"},
      {"name": "_amounts", "type": "uint256[]", "internalType": "uint256[]"}
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "launchShip",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getCcipFee",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getShipStatus",
    "inputs": [],
    "outputs": [
      {"name": "_currentPassengers", "type": "uint8", "internalType": "uint8"},
      {"name": "_capacity", "type": "uint8", "internalType": "uint8"},
      {"name": "_collectedFees", "type": "uint256", "internalType": "uint256"},
      {"name": "_isLaunched", "type": "bool", "internalType": "bool"},
      {"name": "_ccipMessageId", "type": "bytes32", "internalType": "bytes32"},
      {"name": "_ccipFee", "type": "uint256", "internalType": "uint256"},
      {"name": "_tokenCount", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getSupportedTokens",
    "inputs": [],
    "outputs": [{"name": "", "type": "address[]", "internalType": "address[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "passengers",
    "inputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "outputs": [{"name": "", "type": "address", "internalType": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "currentPassengers",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "CAPACITY",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isLaunched",
    "inputs": [],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "PassengerBoarded",
    "inputs": [
      {"name": "passenger", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "tokens", "type": "address[]", "indexed": false, "internalType": "address[]"},
      {"name": "amounts", "type": "uint256[]", "indexed": false, "internalType": "uint256[]"},
      {"name": "passengerCount", "type": "uint8", "indexed": false, "internalType": "uint8"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ShipLaunched",
    "inputs": [
      {"name": "messageId", "type": "bytes32", "indexed": true, "internalType": "bytes32"},
      {"name": "tokens", "type": "address[]", "indexed": false, "internalType": "address[]"},
      {"name": "totalAmounts", "type": "uint256[]", "indexed": false, "internalType": "uint256[]"}
    ],
    "anonymous": false
  }
] as const

export const ERC20_ABI = [
  {
    "type": "function",
    "name": "approve",
    "inputs": [
      {"name": "spender", "type": "address", "internalType": "address"},
      {"name": "amount", "type": "uint256", "internalType": "uint256"}
    ],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "allowance",
    "inputs": [
      {"name": "owner", "type": "address", "internalType": "address"},
      {"name": "spender", "type": "address", "internalType": "address"}
    ],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [{"name": "account", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "decimals",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint8", "internalType": "uint8"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "symbol",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "name",
    "inputs": [],
    "outputs": [{"name": "", "type": "string", "internalType": "string"}],
    "stateMutability": "view"
  }
] as const 