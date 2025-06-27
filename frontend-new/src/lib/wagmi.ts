import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { arbitrumSepolia, sepolia, mainnet } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'StarBridge',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'YOUR_WALLETCONNECT_PROJECT_ID',
  chains: [arbitrumSepolia, sepolia, mainnet],
  ssr: true,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
} 