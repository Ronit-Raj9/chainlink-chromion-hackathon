"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

interface Chain {
  id: string
  name: string
  icon: string
  color: string
  type: "L1" | "L2"
}

const chains: Chain[] = [
  { id: "ethereum", name: "Ethereum", icon: "💎", color: "#627EEA", type: "L1" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔵", color: "#28A0F0", type: "L2" },
  { id: "polygon", name: "Polygon", icon: "🟣", color: "#8247E5", type: "L2" },
  { id: "optimism", name: "Optimism", icon: "🔴", color: "#FF0420", type: "L2" },
  { id: "base", name: "Base", icon: "🔷", color: "#0052FF", type: "L2" },
]

interface PlanetSelectorProps {
  type: "source" | "target"
  selectedChain: string
  onChainSelect: (chainId: string) => void
  bridgeState: string
  excludeChain?: string
}

export function PlanetSelector({ type, selectedChain, onChainSelect, bridgeState, excludeChain }: PlanetSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const availableChains = chains.filter((chain) => {
    if (excludeChain && chain.id === excludeChain) return false
    if (type === "source") return chain.type === "L2"
    return chain.type === "L1"
  })

  const selectedChainData = chains.find((c) => c.id === selectedChain)

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2 neon-text font-orbitron">
          {type === "source" ? "🌍 SOURCE WORLD" : "🌕 TARGET WORLD"}
        </h3>
        <p className="text-sm text-gray-400 font-tech">
          {type === "source" ? "Layer 2 Departure" : "Layer 1 Destination"}
        </p>
      </div>

      <div className="relative">
        {/* Main Planet */}
        <motion.div
          className="relative cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl border-4 transition-all duration-500 ${
              selectedChainData
                ? `border-electric-blue bg-gradient-to-br from-${selectedChainData.color}/20 to-transparent neon-glow`
                : "border-gray-600 bg-slate-grey/40 hover:border-electric-blue"
            }`}
            animate={{
              rotate: bridgeState === "launching" || bridgeState === "traveling" ? 360 : 0,
            }}
            transition={{
              duration: bridgeState === "launching" || bridgeState === "traveling" ? 2 : 0,
              repeat: bridgeState === "launching" || bridgeState === "traveling" ? Number.POSITIVE_INFINITY : 0,
              ease: "linear",
            }}
          >
            {selectedChainData ? selectedChainData.icon : "🌌"}
          </motion.div>

          {/* Orbital Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-electric-blue/30 rounded-full"
            style={{ width: "140px", height: "140px", left: "-4px", top: "-4px" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          {/* Pulsing Effect */}
          {selectedChainData && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-electric-blue/50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* Chain Selection Menu */}
        <AnimatePresence>
          {isExpanded && (
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
                      onClick={() => {
                        onChainSelect(chain.id)
                        setIsExpanded(false)
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        selectedChain === chain.id
                          ? "bg-electric-blue/20 border border-electric-blue/50"
                          : "hover:bg-slate-grey/40 border border-transparent"
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
      </div>
    </div>
  )
}
