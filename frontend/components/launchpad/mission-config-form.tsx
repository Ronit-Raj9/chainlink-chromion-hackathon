"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Zap, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Participant } from "@/types/launchpad"

interface MissionConfigFormProps {
  amount: string
  setAmount: (amount: string) => void
  token: string
  setToken: (token: string) => void
  missionName: string
  setMissionName: (name: string) => void
  sourceChain: string
  targetChain: string
  gasPrice: number
  etaMinutes: number
  participants: Participant[]
  disabled: boolean
}

export function MissionConfigForm({
  amount,
  setAmount,
  token,
  setToken,
  missionName,
  setMissionName,
  sourceChain,
  targetChain,
  gasPrice,
  etaMinutes,
  participants,
  disabled,
}: MissionConfigFormProps) {
  const [gasSavings, setGasSavings] = useState(0)
  const [showNamePrompt, setShowNamePrompt] = useState(false)
  const tokens = ["ETH", "USDC", "USDT", "DAI", "WBTC"]

  // Calculate gas savings based on participants
  useEffect(() => {
    if (participants.length > 0) {
      // More participants = more savings
      const baseGas = gasPrice
      const savingsPercent = Math.min(90, participants.length * 10) // Max 90% savings
      setGasSavings((baseGas * savingsPercent) / 100)
    } else {
      setGasSavings(0)
    }
  }, [participants.length, gasPrice])

  // Show mission name prompt when amount is entered but name is empty
  useEffect(() => {
    if (amount && !missionName && !showNamePrompt) {
      const timer = setTimeout(() => {
        setShowNamePrompt(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [amount, missionName, showNamePrompt])

  const isFormComplete = sourceChain && targetChain && amount && sourceChain !== targetChain

  return (
    <motion.div
      className="bg-slate-grey/20 backdrop-blur-md rounded-lg border border-cosmic-purple/30 p-6 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold mb-4 text-center neon-text font-orbitron">🛸 MISSION PARAMETERS</h3>

      <div className="space-y-4">
        {/* Mission Name */}
        <div>
          <label className="block text-sm font-medium mb-2 text-electric-blue font-tech">MISSION NAME</label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Name your starship..."
              value={missionName}
              onChange={(e) => setMissionName(e.target.value)}
              disabled={disabled}
              className="bg-black/60 border-electric-blue/30 text-white placeholder-gray-500 font-tech focus:border-electric-blue focus:ring-electric-blue/20"
            />
            {showNamePrompt && !missionName && (
              <motion.div
                className="absolute -right-6 top-1/2 transform -translate-y-1/2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-cosmic-purple cursor-help">
                        <Info className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p className="text-sm">Name your starship for mission records!</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            )}
          </div>
        </div>

        {/* Amount and Token */}
        <div>
          <label className="block text-sm font-medium mb-2 text-electric-blue font-tech">PAYLOAD AMOUNT</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={disabled}
              className="bg-black/60 border-electric-blue/30 text-white placeholder-gray-500 font-tech text-lg focus:border-electric-blue focus:ring-electric-blue/20"
            />
            <Select value={token} onValueChange={setToken} disabled={disabled}>
              <SelectTrigger className="w-24 bg-black/60 border-electric-blue/30 font-tech">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-electric-blue/30">
                {tokens.map((t) => (
                  <SelectItem key={t} value={t} className="font-tech">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mission Stats */}
        {isFormComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 bg-black/40 rounded-lg border border-neon-green/20"
          >
            <div className="space-y-3 text-xs font-tech">
              {/* Gas Savings */}
              <div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-neon-green" />
                    <span className="text-gray-400">Gas Savings:</span>
                  </div>
                  <span className="text-neon-green">
                    {gasSavings.toFixed(4)} ETH ({Math.min(90, participants.length * 10)}%)
                  </span>
                </div>
                <Progress
                  value={Math.min(90, participants.length * 10)}
                  className="h-1 bg-slate-grey"
                  indicatorClassName="bg-neon-green"
                />
              </div>

              {/* Participants */}
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-cosmic-purple" />
                  <span className="text-gray-400">Participants:</span>
                </div>
                <span className="text-cosmic-purple">{participants.length}/10 seats filled</span>
              </div>

              {/* ETA */}
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1 text-electric-blue" />
                  <span className="text-gray-400">Estimated Time:</span>
                </div>
                <span className="text-electric-blue">~{etaMinutes} minutes</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
