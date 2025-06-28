import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrumSepolia, sepolia } from 'wagmi/chains'

// Configure supported chains
export const supportedChains = [arbitrumSepolia, sepolia] as const

// Create wagmi config
export const wagmiConfig = getDefaultConfig({
  appName: 'EthBus - Cross Chain Bridge',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'default-project-id',
  chains: supportedChains,
  ssr: true,
})

// Chain selectors for CCIP
export const CCIP_CHAIN_SELECTORS = {
  [arbitrumSepolia.id]: '3478487238524512106', // Arbitrum Sepolia
  [sepolia.id]: '16015286601757825753', // Ethereum Sepolia
} as const

// Helper functions
export const getChainName = (chainId: number): string => {
  switch (chainId) {
    case arbitrumSepolia.id:
      return 'Arbitrum Sepolia'
    case sepolia.id:
      return 'Ethereum Sepolia'
    default:
      return 'Unknown Chain'
  }
}

export const getChainIcon = (chainId: number): string => {
  switch (chainId) {
    case arbitrumSepolia.id:
      return '🔵'
    case sepolia.id:
      return '⚡'
    default:
      return '❓'
  }
}

declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig
  }
} 