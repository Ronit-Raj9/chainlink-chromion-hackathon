export const CONTRACTS = {
  // Arbitrum Sepolia (Source L2)
  SHIP_FACTORY: {
    address: "0x0b990c4e9119321cfc9ee7385c97422c4bd9f66c",
    chainId: 421614, // Arbitrum Sepolia
  },
  // Ethereum Sepolia (Destination L1) 
  SHIP_RECEIVER: {
    address: "0x0b990c4e9119321cfc9ee7385c97422c4bd9f66c", 
    chainId: 11155111, // Ethereum Sepolia
  }
} as const

// Chainlink CCIP Chain Selectors
export const CCIP_CHAIN_SELECTORS = {
  ETHEREUM_SEPOLIA: "16015286601757825753",
  ARBITRUM_SEPOLIA: "3478487238524512106",
} as const

// Supported tokens on each chain
export const SUPPORTED_TOKENS = {
  // Arbitrum Sepolia
  421614: {
    USDC: {
      address: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
      decimals: 6,
      symbol: "USDC"
    },
    LINK: {
      address: "0xb1D4538B4571d411F07960EF2838Ce337FE1E80E", 
      decimals: 18,
      symbol: "LINK"
    },
    // Add more supported tokens here
  },
  // Ethereum Sepolia  
  11155111: {
    USDC: {
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 6,
      symbol: "USDC"
    },
    LINK: {
      address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
      decimals: 18, 
      symbol: "LINK"
    },
  }
} as const

// Chain configurations
export const CHAIN_CONFIG = {
  421614: {
    name: "Arbitrum Sepolia",
    rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
    blockExplorer: "https://sepolia.arbiscan.io",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    type: "L2" as const,
    icon: "🔵"
  },
  11155111: {
    name: "Ethereum Sepolia", 
    rpcUrl: "https://rpc.sepolia.org",
    blockExplorer: "https://sepolia.etherscan.io",
    nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
    type: "L1" as const,
    icon: "💎"
  }
} as const

// Ship Factory ABI (simplified - add more methods as needed)
export const SHIP_FACTORY_ABI = [
  {
    type: "function",
    name: "createShip",
    inputs: [
      { name: "_tokens", type: "address[]" },
      { name: "_amounts", type: "uint256[]" },
      { name: "_destinationChainSelector", type: "uint64" },
      { name: "_capacity", type: "uint8" },
      { name: "_destinationShipReceiver", type: "address" }
    ],
    outputs: [{ name: "shipAddress", type: "address" }],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "calculateCreationFee",
    inputs: [
      { name: "_capacity", type: "uint8" },
      { name: "_tokenCount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function", 
    name: "getUserShips",
    inputs: [{ name: "_user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getShip", 
    inputs: [{ name: "_shipId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "ShipCreated",
    inputs: [
      { name: "shipId", type: "uint256", indexed: true },
      { name: "creator", type: "address", indexed: true },
      { name: "shipAddress", type: "address", indexed: true },
      { name: "tokens", type: "address[]" },
      { name: "capacity", type: "uint8" },
      { name: "destinationChainSelector", type: "uint64" },
      { name: "feePaid", type: "uint256" }
    ]
  }
] as const

// Ship ABI (simplified)
export const SHIP_ABI = [
  {
    type: "function",
    name: "boardShip",
    inputs: [
      { name: "_tokens", type: "address[]" },
      { name: "_amounts", type: "uint256[]" }
    ],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "launchShip", 
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getShipStatus",
    inputs: [],
    outputs: [
      { name: "_currentPassengers", type: "uint8" },
      { name: "_capacity", type: "uint8" },
      { name: "_collectedFees", type: "uint256" },
      { name: "_isLaunched", type: "bool" },
      { name: "_ccipMessageId", type: "bytes32" },
      { name: "_ccipFee", type: "uint256" },
      { name: "_tokenCount", type: "uint256" }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getCcipFee",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getSupportedTokens",
    inputs: [],
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "PassengerBoarded",
    inputs: [
      { name: "passenger", type: "address", indexed: true },
      { name: "tokens", type: "address[]" },
      { name: "amounts", type: "uint256[]" },
      { name: "passengerCount", type: "uint8" }
    ]
  },
  {
    type: "event", 
    name: "ShipLaunched",
    inputs: [
      { name: "messageId", type: "bytes32", indexed: true },
      { name: "tokens", type: "address[]" },
      { name: "totalAmounts", type: "uint256[]" }
    ]
  }
] as const

// ERC20 ABI (simplified)
export const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  }
] as const 