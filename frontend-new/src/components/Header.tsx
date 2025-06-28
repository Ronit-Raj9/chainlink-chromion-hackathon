"use client"

import { motion } from "framer-motion"
import { Rocket, Settings, ChevronDown, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount, useChainId, useSwitchChain, useBalance } from 'wagmi'
import { formatEther } from 'viem'
import { toast } from 'react-hot-toast'
import { useState } from 'react'
import ConnectWallet from "./ConnectWallet"
import { supportedChains } from '@/lib/wagmi'

// Chain configuration for the header
const CHAIN_WORLDS = {
  [supportedChains[0].id]: {
    name: 'Arbitrum',
    icon: '🔵',
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/50'
  },
  [supportedChains[1].id]: {
    name: 'Ethereum',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/50'
  }
}

export default function Header() {
  const pathname = usePathname()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { data: ethBalance } = useBalance({ address })
  const [showChainSelector, setShowChainSelector] = useState(false)
  
  const currentChain = chainId ? CHAIN_WORLDS[chainId as keyof typeof CHAIN_WORLDS] : null
  const isOnSupportedChain = chainId && Object.keys(CHAIN_WORLDS).includes(chainId.toString())

  const handleSwitchChain = async (newChainId: number) => {
    try {
      await switchChain({ chainId: newChainId as 421614 | 11155111 })
      setShowChainSelector(false)
      toast.success(`Switched to ${CHAIN_WORLDS[newChainId as keyof typeof CHAIN_WORLDS]?.name}`)
    } catch (error) {
      console.error('Failed to switch chain:', error)
      toast.error('Failed to switch network')
    }
  }
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full py-4 px-4 bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/20"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-cosmic-purple rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue to-cosmic-purple rounded-lg blur-lg opacity-50 -z-10"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-orbitron text-white">StarBridge</h1>
            </div>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link 
            href="/launchpad" 
            className={`transition-colors font-tech ${
              pathname === "/launchpad" ? "text-electric-blue" : "text-gray-300 hover:text-white"
            }`}
          >
            Launchpad
          </Link>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech">Routes</a>
          <Link 
            href="/dashboard" 
            className={`transition-colors font-tech ${
              pathname === "/dashboard" ? "text-electric-blue" : "text-gray-300 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech">AI Assistant</a>
        </nav>

        {/* Right side - Chain Selector + Wallet */}
        <div className="flex items-center space-x-4">
          {/* Chain Selector */}
          {isConnected && (
            <div className="relative">
              {/* Network Warning */}
              {!isOnSupportedChain && (
                <div className="absolute -top-12 right-0 bg-red-500/20 border border-red-500/50 rounded-lg p-2 text-center min-w-[200px] z-50">
                  <div className="flex items-center justify-center gap-2 text-red-400 text-xs mb-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Unsupported Network</span>
                  </div>
                  <div className="text-red-300 text-xs">Switch to supported network</div>
                </div>
              )}
              
              <button
                onClick={() => setShowChainSelector(!showChainSelector)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all ${
                  isOnSupportedChain 
                    ? 'bg-gray-800/60 border-cyan-500/30 hover:border-cyan-400/50' 
                    : 'bg-red-500/20 border-red-500/50 hover:border-red-400/50'
                }`}
              >
                {currentChain ? (
                  <>
                    <span className="text-lg">{currentChain.icon}</span>
                    <span className="text-white text-sm font-medium hidden sm:block">{currentChain.name}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 text-sm font-medium hidden sm:block">Unknown</span>
                  </>
                )}
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showChainSelector ? 'rotate-180' : ''}`} />
              </button>

              {/* Chain Dropdown */}
              {showChainSelector && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-md border border-cyan-500/30 rounded-lg shadow-xl z-50 min-w-[180px]"
                >
                  {supportedChains.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => handleSwitchChain(chain.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-cyan-500/10 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        chainId === chain.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-white'
                      }`}
                    >
                      <span className="text-lg">{CHAIN_WORLDS[chain.id as keyof typeof CHAIN_WORLDS]?.icon}</span>
                      <div>
                        <div className="font-medium">{CHAIN_WORLDS[chain.id as keyof typeof CHAIN_WORLDS]?.name}</div>
                        <div className="text-xs text-gray-400">{chain.name}</div>
                      </div>
                      {chainId === chain.id && (
                        <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          )}

          {/* Balance Display */}
          {isConnected && ethBalance && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-2 bg-gray-800/60 rounded-lg border border-cyan-500/30">
              <span className="text-cyan-400 text-sm font-medium">
                {parseFloat(formatEther(ethBalance.value)).toFixed(4)} ETH
              </span>
            </div>
          )}

          {/* Connect Wallet Button */}
          <ConnectWallet />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden mt-4 pt-4 border-t border-gray-700/50">
        <nav className="flex items-center justify-center space-x-6">
          <Link 
            href="/launchpad" 
            className={`transition-colors font-tech text-sm ${
              pathname === "/launchpad" ? "text-electric-blue" : "text-gray-300 hover:text-white"
            }`}
          >
            Launchpad
          </Link>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech text-sm">Routes</a>
          <Link 
            href="/dashboard" 
            className={`transition-colors font-tech text-sm ${
              pathname === "/dashboard" ? "text-electric-blue" : "text-gray-300 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech text-sm">AI Assistant</a>
        </nav>
      </div>

      {/* Click outside to close dropdown */}
      {showChainSelector && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowChainSelector(false)}
        />
      )}
    </motion.header>
  )
} 