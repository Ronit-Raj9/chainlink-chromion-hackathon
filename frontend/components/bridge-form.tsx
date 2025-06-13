"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import type { BridgeConfig, BridgeState } from "./mission-control"

interface BridgeFormProps {
  config: BridgeConfig
  onConfigChange: (config: Partial<BridgeConfig>) => void
  bridgeState: BridgeState
}

export function BridgeForm({ config, onConfigChange, bridgeState }: BridgeFormProps) {
  const tokens = ["ETH", "USDC", "USDT", "DAI", "WBTC"]

  const isDisabled = bridgeState === "launching" || bridgeState === "traveling" || bridgeState === "landing"

  return (
    <motion.div
      className="bg-slate-grey/20 backdrop-blur-md rounded-lg border border-cosmic-purple/30 p-6 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold mb-4 text-center neon-text font-orbitron">🛸 CARGO MANIFEST</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-electric-blue font-tech">PAYLOAD AMOUNT</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={config.amount}
              onChange={(e) => onConfigChange({ amount: e.target.value })}
              disabled={isDisabled}
              className="bg-black/60 border-electric-blue/30 text-white placeholder-gray-500 font-tech text-lg focus:border-electric-blue focus:ring-electric-blue/20"
            />
            <Select value={config.token} onValueChange={(token) => onConfigChange({ token })} disabled={isDisabled}>
              <SelectTrigger className="w-24 bg-black/60 border-electric-blue/30 font-tech">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-electric-blue/30">
                {tokens.map((token) => (
                  <SelectItem key={token} value={token} className="font-tech">
                    {token}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {config.amount && config.sourceChain && config.targetChain && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-black/40 rounded-lg border border-neon-green/20"
          >
            <h4 className="font-bold text-neon-green mb-2 font-tech text-sm">MISSION PARAMETERS</h4>
            <div className="space-y-1 text-xs font-tech">
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Gas Savings:</span>
                <span className="text-neon-green">0.008 ETH (89%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Bridge Fee:</span>
                <span className="text-white">0.001 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Time:</span>
                <span className="text-electric-blue">~15 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Security Level:</span>
                <span className="text-cosmic-purple">MAXIMUM 🛡️</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
