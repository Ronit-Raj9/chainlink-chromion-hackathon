"use client"

import { motion } from "framer-motion"

interface CargoManifestProps {
  amount: string
  setAmount: (amount: string) => void
  token: string
  setToken: (token: string) => void
  disabled?: boolean
}

const tokens = [
  { id: "USDC", name: "USDC", icon: "💰" },
  { id: "ETH", name: "ETH", icon: "💎" },
  { id: "LINK", name: "LINK", icon: "🔗" },
]

export default function CargoManifest({
  amount,
  setAmount,
  token,
  setToken,
  disabled = false
}: CargoManifestProps) {

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Only allow positive numbers and empty string
    if (value === '' || (parseFloat(value) >= 0 && !isNaN(parseFloat(value)))) {
      setAmount(value)
    }
  }

  const isAmountValid = amount !== '' && parseFloat(amount) > 0
  const estimatedGasSavings = isAmountValid ? "0.003 ETH (69%)" : "0.001 ETH"
  const bridgeFee = isAmountValid ? "0.001 ETH" : "0.001 ETH"
  const estimatedTime = isAmountValid ? "~15 seconds" : "~15 seconds"
  const securityLevel = "Maximum ❤️"

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="glass-effect rounded-2xl p-6 space-y-6 max-w-md mx-auto"
    >
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold mb-2 neon-text font-orbitron">
          📋 CARGO MANIFEST
        </h3>
      </div>

      {/* Payload Amount */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-electric-blue font-tech">
          PAYLOAD AMOUNT
        </label>
        <div className="flex space-x-2">
          <input
            type="number"
            placeholder="0.0001"
            value={amount}
            onChange={handleAmountChange}
            min="0"
            step="0.0001"
            disabled={disabled}
            className={`
              flex-1 bg-black/60 border-2 text-white placeholder-gray-500 font-tech text-lg px-4 py-3 rounded-lg
              focus:ring-electric-blue/20 transition-all outline-none
              ${isAmountValid 
                ? "border-electric-blue/50 focus:border-electric-blue" 
                : "border-gray-600 focus:border-gray-500"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
          />
          
          {/* Token Selector */}
          <select 
            value={token} 
            onChange={(e) => setToken(e.target.value)}
            disabled={disabled}
            className={`
              bg-black/60 border-2 text-white font-tech px-4 py-3 rounded-lg outline-none
              ${token ? "border-electric-blue/50" : "border-gray-600"}
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-electric-blue/70"}
            `}
          >
            {tokens.map((t) => (
              <option key={t.id} value={t.id} className="bg-black text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mission Parameters */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold text-electric-blue font-orbitron">MISSION PARAMETERS</h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm font-tech">
          <div>
            <div className="text-gray-400">Estimated Gas Savings:</div>
            <div className="text-neon-cyan font-semibold">{estimatedGasSavings}</div>
          </div>
          <div>
            <div className="text-gray-400">Bridge Fee:</div>
            <div className="text-neon-cyan font-semibold">{bridgeFee}</div>
          </div>
          <div>
            <div className="text-gray-400">Estimated Time:</div>
            <div className="text-neon-cyan font-semibold">{estimatedTime}</div>
          </div>
          <div>
            <div className="text-gray-400">Security Level:</div>
            <div className="text-neon-cyan font-semibold">{securityLevel}</div>
          </div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="text-center pt-4 border-t border-gray-700">
        {isAmountValid && token ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center space-x-2 text-green-400"
          >
            <span>✅</span>
            <span className="font-tech text-sm">📋 Configure Mission Parameters</span>
          </motion.div>
        ) : (
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <span>⏳</span>
            <span className="font-tech text-sm">📋 Configure Mission Parameters</span>
          </div>
        )}
      </div>
    </motion.div>
  )
} 