import { Transaction } from '@/app/dashboard/page'

export const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo_ship_creation_1',
    type: 'ship_creation',
    hash: '0x1234567890abcdef1234567890abcdef12345678',
    timestamp: Date.now() - 3600000, // 1 hour ago
    status: 'confirmed',
    amount: '0.005',
    token: 'ETH',
    description: 'Created ship with 2 tokens and 5 capacity',
    metadata: {
      tokens: ['0xUSDC', '0xWETH'],
      amounts: ['100', '0.1'],
      capacity: 5,
      destinationChain: 11155111
    },
    blockNumber: 12345678,
    gasUsed: '234567'
  },
  {
    id: 'demo_ship_boarding_1',
    type: 'ship_boarding',
    hash: '0xabcdef1234567890abcdef1234567890abcdef12',
    timestamp: Date.now() - 1800000, // 30 minutes ago
    status: 'confirmed',
    amount: '0.001',
    token: 'ETH',
    shipAddress: '0x1234567890abcdef1234567890abcdef12345678',
    description: 'Boarded ship with 1 tokens',
    metadata: {
      tokens: ['0xUSDC'],
      amounts: ['50'],
      shipAddress: '0x1234567890abcdef1234567890abcdef12345678'
    },
    blockNumber: 12345679,
    gasUsed: '156789'
  },
  {
    id: 'demo_token_approval_1',
    type: 'token_approval',
    hash: '0xfedcba0987654321fedcba0987654321fedcba09',
    timestamp: Date.now() - 900000, // 15 minutes ago
    status: 'confirmed',
    amount: '1000',
    token: 'USDC',
    description: 'Approved 1000 USDC for spending',
    metadata: {
      tokenAddress: '0xUSDC_ADDRESS',
      spender: '0xSPENDER_ADDRESS',
      amount: '1000'
    },
    blockNumber: 12345680,
    gasUsed: '45678'
  },
  {
    id: 'demo_ship_launch_1',
    type: 'ship_launch',
    hash: '0x567890abcdef1234567890abcdef1234567890ab',
    timestamp: Date.now() - 300000, // 5 minutes ago
    status: 'pending',
    shipAddress: '0x1234567890abcdef1234567890abcdef12345678',
    description: 'Launched ship to destination chain',
    metadata: {
      shipAddress: '0x1234567890abcdef1234567890abcdef12345678'
    }
  },
  {
    id: 'demo_ship_creation_2',
    type: 'ship_creation',
    hash: '0x9876543210fedcba9876543210fedcba98765432',
    timestamp: Date.now() - 120000, // 2 minutes ago
    status: 'failed',
    amount: '0.008',
    token: 'ETH',
    description: 'Created ship with 3 tokens and 10 capacity',
    metadata: {
      tokens: ['0xUSDC', '0xWETH', '0xLINK'],
      amounts: ['200', '0.2', '50'],
      capacity: 10,
      destinationChain: 11155111,
      error: 'Insufficient gas for transaction'
    }
  }
]

// Function to add demo transactions to local storage
export function addDemoTransactions(userAddress: string) {
  if (!userAddress) return

  const storageKey = `starbridge_transactions_${userAddress.toLowerCase()}`
  const existing = JSON.parse(localStorage.getItem(storageKey) || '[]')
  
  // Only add demo transactions if storage is empty
  if (existing.length === 0) {
    localStorage.setItem(storageKey, JSON.stringify(DEMO_TRANSACTIONS))
    console.log('Demo transactions added to local storage')
  }
}

// Function to clear all transactions (including demo)
export function clearAllTransactions(userAddress: string) {
  if (!userAddress) return

  const storageKey = `starbridge_transactions_${userAddress.toLowerCase()}`
  const statsKey = `starbridge_stats_${userAddress.toLowerCase()}`
  
  localStorage.removeItem(storageKey)
  localStorage.removeItem(statsKey)
  
  console.log('All transactions cleared from local storage')
}

// Function to get transaction by hash
export function getTransactionByHash(userAddress: string, hash: string): Transaction | null {
  if (!userAddress) return null

  const storageKey = `starbridge_transactions_${userAddress.toLowerCase()}`
  const transactions: Transaction[] = JSON.parse(localStorage.getItem(storageKey) || '[]')
  
  return transactions.find(tx => tx.hash === hash) || null
}