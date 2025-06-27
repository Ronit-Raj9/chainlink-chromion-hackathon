"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import type { LaunchState } from "./LaunchpadInterface"

interface Chain {
  id: string
  name: string
  icon: string
  type: "L1" | "L2"
}

const chains: Chain[] = [
  { id: "ethereum-sepolia", name: "Ethereum", icon: "💎", type: "L1" },
  { id: "arbitrum-sepolia", name: "Arbitrum", icon: "🔵", type: "L2" },
  { id: "polygon", name: "Polygon", icon: "🟣", type: "L2" },
  { id: "optimism", name: "Optimism", icon: "🔴", type: "L2" },
  { id: "base", name: "Base", icon: "🔷", type: "L2" },
]

interface ChainSelectorProps {
  type: "source" | "target"
  selectedChain: string
  onChainSelect: (chainId: string) => void
  launchState: LaunchState
}

export default function ChainSelector({ type, selectedChain, onChainSelect, launchState }: ChainSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const availableChains = chains.filter((chain) => {
    if (type === "source") return chain.type === "L2" // Only L2 for source
    return chain.type === "L1" // Only L1 for target
  })

  const selectedChainData = chains.find((c) => c.id === selectedChain)

  // Only disable during active transactions
  const isDisabled = launchState === "launching" || launchState === "traveling"

  const handlePlanetClick = () => {
    if (isDisabled) return
    setIsExpanded(!isExpanded)
  }

  const handleChainSelect = (chainId: string) => {
    if (isDisabled) return
    onChainSelect(chainId)
    setIsExpanded(false)
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 neon-text font-orbitron">
          {type === "source" ? "🌍 SOURCE WORLD" : "🌕 TARGET WORLD"}
        </h3>
        <p className="text-sm text-gray-400 font-tech">
          {type === "source" ? "Layer 2 Departure" : "Layer 1 Destination"}
        </p>
      </div>

      {/* Planet Container */}
      <div className="relative">
        {/* Main Planet */}
        <motion.div
          className={`relative w-32 h-32 rounded-full flex items-center justify-center text-4xl border-4 transition-all duration-300 ${
            isDisabled 
              ? "opacity-50 cursor-not-allowed" 
              : "cursor-pointer hover:scale-105"
          } ${
            selectedChainData
              ? "border-electric-blue bg-gradient-to-br from-electric-blue/20 to-cosmic-purple/20 neon-glow"
              : "border-gray-600 bg-gray-800/40 hover:border-electric-blue"
          }`}
          onClick={handlePlanetClick}
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          animate={{
            rotate: isDisabled ? 360 : 0,
          }}
          transition={{
            duration: isDisabled ? 2 : 0,
            repeat: isDisabled ? Infinity : 0,
            ease: "linear",
          }}
        >
          {selectedChainData ? selectedChainData.icon : "🌌"}
        </motion.div>

        {/* Orbital Ring */}
        <motion.div
          className="absolute inset-0 border-2 border-electric-blue/30 rounded-full pointer-events-none"
          style={{ width: "140px", height: "140px", left: "-4px", top: "-4px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Selection Menu */}
        <AnimatePresence>
          {isExpanded && !isDisabled && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-10"
                onClick={() => setIsExpanded(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 z-20"
              >
                <div className="bg-black/90 backdrop-blur-md rounded-lg border border-electric-blue/30 p-4 min-w-[200px]">
                  <div className="space-y-2">
                    {availableChains.map((chain) => (
                      <motion.button
                        key={chain.id}
                        onClick={() => handleChainSelect(chain.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          selectedChain === chain.id
                            ? "bg-electric-blue/20 border border-electric-blue/50"
                            : "hover:bg-gray-700/40 border border-transparent"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{chain.icon}</span>
                        <div className="text-left">
                          <div className="font-bold text-white">{chain.name}</div>
                          <div className="text-xs text-gray-400">{chain.type}</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Selected Chain Label */}
        {selectedChainData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center"
          >
            <div className="bg-black/80 px-3 py-1 rounded-full border border-electric-blue/30">
              <span className="text-sm font-tech text-electric-blue">{selectedChainData.name}</span>
            </div>
          </motion.div>
        )}

        {/* Click Hint */}
        {!isDisabled && (
          <motion.div
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-center"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-xs text-gray-500 font-tech">Click to change</span>
          </motion.div>
        )}
      </div>
    </div>
  )
} 