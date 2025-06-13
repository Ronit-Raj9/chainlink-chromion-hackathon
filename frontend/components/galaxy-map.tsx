"use client"

import { useState } from "react"

interface Chain {
  id: string
  name: string
  icon: string
  x: number
  y: number
  color: string
}

const chains: Chain[] = [
  { id: "ethereum", name: "Ethereum", icon: "💎", x: 50, y: 30, color: "#627EEA" },
  { id: "arbitrum", name: "Arbitrum", icon: "🔵", x: 30, y: 60, color: "#28A0F0" },
  { id: "polygon", name: "Polygon", icon: "🟣", x: 70, y: 70, color: "#8247E5" },
  { id: "optimism", name: "Optimism", icon: "🔴", x: 20, y: 40, color: "#FF0420" },
  { id: "base", name: "Base", icon: "🔷", x: 80, y: 40, color: "#0052FF" },
]

export function GalaxyMap() {
  const [selectedFrom, setSelectedFrom] = useState<string | null>(null)
  const [selectedTo, setSelectedTo] = useState<string | null>(null)
  const [hoveredChain, setHoveredChain] = useState<string | null>(null)

  const handleChainClick = (chainId: string) => {
    if (!selectedFrom) {
      setSelectedFrom(chainId)
    } else if (!selectedTo && chainId !== selectedFrom) {
      setSelectedTo(chainId)
    } else {
      setSelectedFrom(chainId)
      setSelectedTo(null)
    }
  }

  return (
    <div className="relative">
      <div className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-8 h-96 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-cosmic-purple/10 to-transparent"></div>

        {/* Connection line */}
        {selectedFrom && selectedTo && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <line
              x1={`${chains.find((c) => c.id === selectedFrom)?.x}%`}
              y1={`${chains.find((c) => c.id === selectedFrom)?.y}%`}
              x2={`${chains.find((c) => c.id === selectedTo)?.x}%`}
              y2={`${chains.find((c) => c.id === selectedTo)?.y}%`}
              stroke="url(#connectionGradient)"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
          </svg>
        )}

        {chains.map((chain) => (
          <div
            key={chain.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 ${
              selectedFrom === chain.id || selectedTo === chain.id
                ? "scale-125 neon-glow"
                : hoveredChain === chain.id
                  ? "scale-110"
                  : "scale-100"
            }`}
            style={{ left: `${chain.x}%`, top: `${chain.y}%` }}
            onClick={() => handleChainClick(chain.id)}
            onMouseEnter={() => setHoveredChain(chain.id)}
            onMouseLeave={() => setHoveredChain(null)}
          >
            <div className="relative">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${
                  selectedFrom === chain.id
                    ? "border-electric-blue bg-electric-blue/20"
                    : selectedTo === chain.id
                      ? "border-cosmic-purple bg-cosmic-purple/20"
                      : "border-gray-600 bg-slate-grey/40 hover:border-white"
                }`}
              >
                {chain.icon}
              </div>

              {(hoveredChain === chain.id || selectedFrom === chain.id || selectedTo === chain.id) && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <div className="bg-black/80 px-2 py-1 rounded text-sm font-tech">{chain.name}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-electric-blue"></div>
            <span>Source Chain</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-cosmic-purple"></div>
            <span>Destination Chain</span>
          </div>
        </div>
      </div>
    </div>
  )
}
