"use client"

import { useState, useEffect } from 'react'
import { useAccount, useChainId, useSwitchChain, useBalance, useReadContract } from 'wagmi'
import { formatEther, erc20Abi, parseEther } from 'viem'
import { toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, ChevronDown, Zap, Users, Clock, AlertTriangle, ExternalLink } from 'lucide-react'

import { useShipFactory } from '@/hooks/useShipFactory'
import { TEST_TOKENS } from '@/lib/contracts'
import { supportedChains } from '@/lib/wagmi'

// Chain configurations
const L2_CHAINS = [
  { 
    id: 421614, // Arbitrum Sepolia
    name: 'Arbitrum', 
    icon: '🔵', 
    color: 'from-blue-400 to-cyan-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-400/50'
  },
  { 
    id: 80001, // Polygon Mumbai (example)
    name: 'Polygon', 
    icon: '🟣', 
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-400/50'
  },
  { 
    id: 420, // Optimism Goerli (example)
    name: 'Optimism', 
    icon: '🔴', 
    color: 'from-red-400 to-orange-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-400/50'
  },
  { 
    id: 84531, // Base Goerli (example)
    name: 'Base', 
    icon: '🔷', 
    color: 'from-blue-300 to-indigo-500',
    bgColor: 'bg-indigo-500/20',
    borderColor: 'border-indigo-400/50'
  }
]

const L1_CHAINS = [
  { 
    id: 11155111, // Ethereum Sepolia
    name: 'Ethereum', 
    icon: '⚡', 
    color: 'from-yellow-400 to-orange-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-400/50'
  },
  // { 
  //   id: 1, // Ethereum Mainnet
  //   name: 'Ethereum Mainnet', 
  //   icon: '💎', 
  //   color: 'from-blue-400 to-purple-500',
  //   bgColor: 'bg-blue-500/20',
  //   borderColor: 'border-blue-400/50'
  // },
  // { 
  //   id: 56, // BSC Mainnet
  //   name: 'BNB Chain', 
  //   icon: '🟡', 
  //   color: 'from-yellow-300 to-yellow-600',
  //   bgColor: 'bg-yellow-500/20',
  //   borderColor: 'border-yellow-400/50'
  // }
]

// Starship component with configurable seats
const Starship = ({ passengerCount, occupiedSeats = 1 }: { passengerCount: number, occupiedSeats?: number }) => {
  const seats = []
  
  // Create seat grid (2 columns)
  for (let i = 0; i < passengerCount; i++) {
    const isOccupied = i < occupiedSeats
    seats.push(
      <motion.div
        key={i}
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
          isOccupied 
            ? 'bg-cyan-500 text-white' 
            : 'bg-gray-600 text-gray-400'
        }`}
        animate={isOccupied ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {isOccupied ? '👤' : '💺'}
      </motion.div>
    )
  }

  return (
    <div className="relative">
      {/* Starship Body */}
      <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full rounded-b-lg p-6 min-w-[200px] border-4 border-yellow-500 shadow-2xl shadow-yellow-500/30">
        {/* Front Window */}
        <div className="w-full h-12 bg-gradient-to-b from-cyan-200 to-cyan-400 rounded-t-full mb-4 border-2 border-cyan-300 flex items-center justify-center">
          <span className="text-2xl">🚀</span>
        </div>
        
        {/* Passenger Area */}
        <div className="bg-gray-800/80 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-center mb-3">
            <span className="text-xs text-yellow-400 font-bold">PASSENGER INFO</span>
          </div>
          
          <div 
            className="grid gap-2 justify-center"
            style={{ 
              gridTemplateColumns: passengerCount === 1 ? '1fr' : 'repeat(2, 1fr)',
              maxWidth: passengerCount <= 2 ? '80px' : '160px',
              margin: '0 auto'
            }}
          >
            {seats}
          </div>
          
          <div className="text-center mt-3">
            <span className="text-xs text-cyan-400">
              {occupiedSeats}/{passengerCount} Passengers
            </span>
          </div>
        </div>
      </div>
      
      {/* Exhaust Animation */}
      <motion.div 
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6]
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="text-2xl">🔥</div>
      </motion.div>
    </div>
  )
}

// Chain Selector Component
const ChainSelector = ({ 
  chains, 
  selectedChain, 
  onSelect, 
  title, 
  side 
}: { 
  chains: typeof L2_CHAINS, 
  selectedChain: number, 
  onSelect: (id: number) => void,
  title: string,
  side: 'left' | 'right'
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center text-cyan-400 mb-6">
        {title}
      </h3>
      
      <div className="space-y-3">
        {chains.map((chain) => (
          <motion.button
            key={chain.id}
            onClick={() => onSelect(chain.id)}
            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 ${
              selectedChain === chain.id
                ? `${chain.bgColor} ${chain.borderColor} shadow-lg`
                : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center space-x-3">
              <div className="text-3xl">{chain.icon}</div>
              <div className="text-left">
                <div className="font-bold text-white">{chain.name}</div>
                <div className="text-xs text-gray-400">
                  {side === 'left' ? 'Layer 2' : 'Layer 1'}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function LaunchpadInterface() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  
  // Form state
  const [sourceChain, setSourceChain] = useState(421614) // Arbitrum Sepolia
  const [targetChain, setTargetChain] = useState(11155111) // Ethereum Sepolia
  const [selectedToken, setSelectedToken] = useState('ETH')
  const [amount, setAmount] = useState('')
  const [passengerCount, setPassengerCount] = useState(1)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Contract hooks
  const { createShip, isCreating, calculateFeeForParams } = useShipFactory()
  const { data: ethBalance } = useBalance({ address })
  
  // Calculate dynamic fee based on current settings
  const [dynamicFee, setDynamicFee] = useState<bigint | null>(null)
  
  // Check CCIP_BnM token balance
  const ccipBnMAddress = TEST_TOKENS[sourceChain as keyof typeof TEST_TOKENS]?.CCIP_BnM as `0x${string}` | undefined
  const { data: ccipBnMBalance } = useReadContract({
    address: ccipBnMAddress,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!ccipBnMAddress && sourceChain === chainId,
    }
  })
  
  useEffect(() => {
    if (passengerCount && selectedToken) {
      calculateFeeForParams(passengerCount, 1).then(setDynamicFee).catch(() => setDynamicFee(null))
    }
  }, [passengerCount, selectedToken, calculateFeeForParams])
  
  // Get available tokens for source chain
  const availableTokens = TEST_TOKENS[sourceChain as keyof typeof TEST_TOKENS] || null
  
  // Check if user is on correct chain
  const isOnCorrectChain = chainId === sourceChain
  const canCreateShip = isConnected && isOnCorrectChain && amount && parseFloat(amount) > 0
  
  // Check if user has sufficient tokens for the selected amount
  const hasInsufficientTokens = Boolean(
    selectedToken === 'ETH' && 
    ccipBnMBalance !== undefined && 
    amount && 
    parseFloat(amount) > 0 && 
    ccipBnMBalance < parseEther(amount)
  )
  
  const handleSwitchChain = async (newChainId: number) => {
    try {
      await switchChain({ chainId: newChainId as 421614 | 11155111 })
    } catch (error) {
      console.error('Failed to switch chain:', error)
      toast.error('Failed to switch network')
    }
  }
  
  const handleCreateShip = async () => {
    if (!canCreateShip) return
    
    try {
      // Validate amount
      const amountNum = parseFloat(amount)
      if (amountNum <= 0) {
        toast.error('Amount must be greater than 0')
        return
      }
      if (amountNum > 100) {
        toast.error('Amount too large (max 100 ETH)')
        return
      }
      
      let tokenAddress = selectedToken
      
      // Map token selection to actual contract addresses
      if (selectedToken === 'ETH') {
        // Use CCIP_BnM as ETH equivalent for cross-chain testing
        tokenAddress = availableTokens?.CCIP_BnM || ''
        if (!tokenAddress) {
          toast.error('CCIP_BnM token not available on this network')
          return
        }
      } else if (availableTokens && selectedToken in availableTokens) {
        tokenAddress = availableTokens[selectedToken as keyof typeof availableTokens]
      }
      
      if (!tokenAddress) {
        toast.error('Invalid token selected')
        return
      }
      
      console.log('🎯 Token mapping:', {
        selected: selectedToken,
        address: tokenAddress,
        availableTokens
      })
      
      // Show confirmation for large amounts or multiple passengers
      if (amountNum > 1 || passengerCount > 1) {
        const message = passengerCount === 1 
          ? `Launch ship immediately with ${amountNum} ${selectedToken}?`
          : `Create ship for ${passengerCount} passengers with ${amountNum} ${selectedToken}?`
        const confirmed = window.confirm(message)
        if (!confirmed) return
      }
      
      const result = await createShip({
        tokens: [tokenAddress],
        amounts: [amount],
        destinationChainId: targetChain,
        capacity: passengerCount
      })
      
      if (result) {
        setAmount('')
        if (passengerCount === 1) {
          toast.success('🚀 Ship launched successfully! Transaction in progress...')
        } else {
          toast.success('🚀 Ship created! Waiting for passengers to board...')
        }
      }
    } catch (error) {
      console.error('Failed to create ship:', error)
      toast.error('Failed to create ship. Please try again.')
    }
  }
  
  const selectedSourceChain = L2_CHAINS.find(c => c.id === sourceChain)
  const selectedTargetChain = L1_CHAINS.find(c => c.id === targetChain)
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Animated Stars Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
            🚀 STARBRIDGE TERMINAL
          </h1>
          <p className="text-lg text-gray-300">
            Board the starship • Bridge across the cosmos • Share the journey
          </p>
        </motion.div>

        {/* Connection Status */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/20 max-w-md mx-auto">
              <div className="text-cyan-400 text-lg font-bold mb-2">Connect Your Wallet</div>
              <div className="text-gray-400 text-sm">
                Connect your wallet using the button in the header to start your journey
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Interface */}
        {isConnected && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Left Side - L2 Chains */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <ChainSelector
                chains={L2_CHAINS}
                selectedChain={sourceChain}
                onSelect={(id) => {
                  setSourceChain(id)
                  if (chainId !== id) {
                    handleSwitchChain(id)
                  }
                }}
                title="🌍 SOURCE WORLDS"
                side="left"
              />
            </motion.div>

            {/* Center - Starship and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Starship Display */}
              <div className="flex justify-center">
                <Starship passengerCount={passengerCount} occupiedSeats={1} />
              </div>

              {/* Control Panel */}
              <div className="bg-gray-900/90 backdrop-blur-md rounded-2xl border border-cyan-500/40 p-6 shadow-2xl shadow-cyan-500/10">
                
                {/* Network Warning */}
                {!isOnCorrectChain && (
                  <div className="mb-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2 text-red-400 text-sm mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Wrong Network</span>
                    </div>
                    <button
                      onClick={() => handleSwitchChain(sourceChain)}
                      className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Switch to {selectedSourceChain?.name}
                    </button>
                  </div>
                )}

                {/* Passenger Count Selection */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-bold mb-3">
                    🧑‍🚀 PASSENGER COUNT
                  </label>
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-black/50 border border-cyan-500/50 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400"
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10].map(count => (
                      <option key={count} value={count}>
                        {count} passenger{count > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-white text-sm font-bold mb-3">
                    💰 CARGO AMOUNT
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 1000)) {
                          setAmount(value)
                        }
                      }}
                      placeholder="0.0"
                      min="0"
                      max="100"
                      step="0.001"
                      className="flex-1 px-4 py-3 bg-black/50 border border-cyan-500/50 rounded-lg text-white text-center text-lg font-mono focus:outline-none focus:border-cyan-400"
                      disabled={!isOnCorrectChain}
                    />
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className="px-3 py-3 bg-black/50 border border-cyan-500/50 rounded-lg text-white font-mono focus:outline-none focus:border-cyan-400 min-w-[80px]"
                      disabled={!isOnCorrectChain}
                    >
                      <option value="ETH">ETH</option>
                      {availableTokens && Object.keys(availableTokens).map(symbol => (
                        <option key={symbol} value={symbol}>{symbol}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Balance Display */}
                  <div className="mt-2 space-y-1">
                    {ethBalance && (
                      <p className="text-gray-400 text-xs text-center">
                        ETH Balance: {parseFloat(formatEther(ethBalance.value)).toFixed(4)} ETH
                      </p>
                    )}
                    
                    {/* CCIP_BnM Balance Warning */}
                    {selectedToken === 'ETH' && isConnected && isOnCorrectChain && (
                      <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <div className="flex items-center gap-2 text-yellow-400 text-sm mb-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="font-bold">Token Required: CCIP_BnM</span>
                        </div>
                        <div className="text-xs text-gray-300 mb-3">
                          ETH selection uses CCIP_BnM token for cross-chain bridging.
                          {ccipBnMBalance !== undefined && (
                            <div className="mt-1">
                              Your CCIP_BnM Balance: <span className="text-white font-mono">
                                {parseFloat(formatEther(ccipBnMBalance)).toFixed(4)}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Faucet Link */}
                        <a
                          href="https://faucets.chain.link/arbitrum-sepolia"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded text-xs hover:bg-yellow-500/30 transition-colors"
                        >
                          <span>🚰 Get CCIP_BnM Tokens</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        
                        {ccipBnMBalance !== undefined && ccipBnMBalance === BigInt(0) && (
                          <div className="mt-2 text-red-400 text-xs">
                            ⚠️ You need CCIP_BnM tokens to complete this transaction
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Advanced Settings */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full mb-4 flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  <span>Mission Parameters</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-6 p-4 bg-black/30 rounded-lg border border-cyan-500/20"
                    >
                      <div className="text-xs text-gray-400">
                        <div>Creation Fee: {dynamicFee ? formatEther(dynamicFee) : '0.001'} ETH</div>
                        <div>Route: {selectedSourceChain?.name} → {selectedTargetChain?.name}</div>
                        {passengerCount > 1 && (
                          <div className="text-cyan-400 mt-2">
                            💡 Gas costs will be shared among {passengerCount} passengers
                          </div>
                        )}
                        
                        {/* Debug Information */}
                        <div className="mt-3 pt-3 border-t border-gray-600">
                          <div className="text-yellow-400 text-xs font-bold mb-2">🔧 Debug Info</div>
                          <div>Network: {chainId} (Expected: {sourceChain})</div>
                          <div>Connected: {isConnected ? '✅' : '❌'}</div>
                          <div>Correct Chain: {isOnCorrectChain ? '✅' : '❌'}</div>
                          <div>Can Create: {canCreateShip ? '✅' : '❌'}</div>
                          {availableTokens && (
                            <div className="mt-2">
                              <div className="text-xs">Available Tokens:</div>
                              {Object.entries(availableTokens).map(([symbol, addr]) => (
                                <div key={symbol} className="text-xs text-gray-500">
                                  {symbol}: {addr.slice(0, 8)}...
                                </div>
                              ))}
                            </div>
                          )}
                          {selectedToken === 'ETH' && availableTokens?.CCIP_BnM && (
                            <div className="mt-1 text-cyan-400 text-xs">
                              ETH → CCIP_BnM: {availableTokens.CCIP_BnM.slice(0, 8)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Button */}
                <motion.button
                  onClick={handleCreateShip}
                  disabled={!canCreateShip || isCreating || hasInsufficientTokens}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 min-h-[56px] ${
                    canCreateShip && !isCreating && !hasInsufficientTokens
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  whileTap={canCreateShip && !hasInsufficientTokens ? { scale: 0.95 } : undefined}
                >
                  {isCreating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Creating Ship...</span>
                    </>
                  ) : !isConnected ? (
                    <span>Connect Wallet</span>
                  ) : !isOnCorrectChain ? (
                    <span>Switch Network</span>
                  ) : hasInsufficientTokens ? (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Insufficient CCIP_BnM</span>
                    </>
                  ) : passengerCount === 1 ? (
                    <>
                      <span className="text-lg">🚀</span>
                      <span>LAUNCH SHIP</span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🎫</span>
                      <span>JOIN SHIP</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Right Side - L1 Chains */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <ChainSelector
                chains={L1_CHAINS}
                selectedChain={targetChain}
                onSelect={setTargetChain}
                title="🌕 TARGET WORLDS"
                side="right"
              />
            </motion.div>
          </div>
        )}

        {/* Status Cards */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20 text-center">
              <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <div className="text-white font-bold">Active Ships</div>
              <div className="text-gray-400 text-sm">Ready for boarding</div>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20 text-center">
              <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-white font-bold">Gas Savings</div>
              <div className="text-gray-400 text-sm">Up to 90% less fees</div>
            </div>
            
            <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/20 text-center">
              <Clock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-white font-bold">Launch Time</div>
              <div className="text-gray-400 text-sm">When ship is full</div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 