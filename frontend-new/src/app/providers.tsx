"use client"

import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
  import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
  import { wagmiConfig } from '@/lib/wagmi'
  import { Toaster } from 'react-hot-toast'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})

// Suppress indexedDB warnings in SSR
if (typeof window === 'undefined') {
  // Suppress console errors during SSR
  const originalError = console.error
  console.error = (...args) => {
    if (args[0]?.includes?.('indexedDB')) return
    originalError(...args)
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#00f5ff',
            accentColorForeground: 'black',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 