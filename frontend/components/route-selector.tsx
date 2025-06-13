"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight, Rocket, Users, Clock } from "lucide-react"

export function RouteSelector() {
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("ETH")
  const [fromChain, setFromChain] = useState("")
  const [toChain, setToChain] = useState("")

  const chains = [
    { value: "ethereum", label: "Ethereum", icon: "💎" },
    { value: "arbitrum", label: "Arbitrum", icon: "🔵" },
    { value: "polygon", label: "Polygon", icon: "🟣" },
    { value: "optimism", label: "Optimism", icon: "🔴" },
    { value: "base", label: "Base", icon: "🔷" },
  ]

  const tokens = ["ETH", "USDC", "USDT", "DAI"]

  const isFormValid = amount && fromChain && toChain && fromChain !== toChain

  return (
    <div className="space-y-6">
      <div className="bg-slate-grey/20 rounded-lg border border-cosmic-purple/20 p-6">
        <h3 className="text-2xl font-bold mb-6 text-center neon-text">Configure Your Mission</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount to Bridge</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-black/40 border-electric-blue/30 text-white placeholder-gray-500"
              />
              <Select value={token} onValueChange={setToken}>
                <SelectTrigger className="w-24 bg-black/40 border-electric-blue/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">From Chain</label>
            <Select value={fromChain} onValueChange={setFromChain}>
              <SelectTrigger className="bg-black/40 border-electric-blue/30">
                <SelectValue placeholder="Select source chain" />
              </SelectTrigger>
              <SelectContent>
                {chains.map((chain) => (
                  <SelectItem key={chain.value} value={chain.value}>
                    <div className="flex items-center space-x-2">
                      <span>{chain.icon}</span>
                      <span>{chain.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-center">
            <ArrowRight className="h-6 w-6 text-electric-blue" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">To Chain</label>
            <Select value={toChain} onValueChange={setToChain}>
              <SelectTrigger className="bg-black/40 border-cosmic-purple/30">
                <SelectValue placeholder="Select destination chain" />
              </SelectTrigger>
              <SelectContent>
                {chains
                  .filter((chain) => chain.value !== fromChain)
                  .map((chain) => (
                    <SelectItem key={chain.value} value={chain.value}>
                      <div className="flex items-center space-x-2">
                        <span>{chain.icon}</span>
                        <span>{chain.label}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFormValid && (
          <div className="mt-6 p-4 bg-black/40 rounded-lg border border-neon-green/20">
            <h4 className="font-bold text-neon-green mb-3">Route Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Gas Savings:</span>
                <span className="text-neon-green">0.008 ETH (89%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Pool Status:</span>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>6/10 seats</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estimated Launch Time:</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>~8 minutes</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <Button
          className="w-full mt-6 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white font-bold py-3 neon-glow"
          disabled={!isFormValid}
        >
          <Rocket className="h-5 w-5 mr-2" />
          Reserve Your Seat
        </Button>
      </div>
    </div>
  )
}
