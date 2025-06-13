"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Rocket, BookmarkPlus, ArrowRight, Clock, AlertTriangle, Zap } from "lucide-react"
import type { RouteRecommendation } from "@/types/mission-assistant"

interface RouteCardProps {
  recommendation: RouteRecommendation
  onLaunch: () => void
  onSave: () => void
}

export function RouteCard({ recommendation, onLaunch, onSave }: RouteCardProps) {
  const getChainIcon = (chain: string) => {
    switch (chain.toLowerCase()) {
      case "ethereum":
        return "💎"
      case "arbitrum":
        return "🔵"
      case "polygon":
        return "🟣"
      case "optimism":
        return "🔴"
      case "base":
        return "🔷"
      default:
        return "🌐"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "text-neon-green"
      case "medium":
        return "text-yellow-400"
      case "high":
        return "text-red-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <motion.div
      className="bg-black/60 backdrop-blur-md rounded-lg border border-electric-blue/30 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-3">
        <h3 className="text-sm font-bold text-electric-blue font-tech">SUGGESTED ROUTE</h3>
      </div>

      {/* Route Visualization */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1">{getChainIcon(recommendation.fromChain)}</div>
          <div className="text-xs text-gray-400">
            {recommendation.fromChain.charAt(0).toUpperCase() + recommendation.fromChain.slice(1)}
          </div>
        </div>
        <div className="flex-1 relative h-0.5 bg-gray-700 max-w-24">
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-lg">🚀</div>
          <motion.div
            className="absolute top-0 left-0 h-full bg-electric-blue"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="text-2xl mb-1">{getChainIcon(recommendation.toChain)}</div>
          <div className="text-xs text-gray-400">
            {recommendation.toChain.charAt(0).toUpperCase() + recommendation.toChain.slice(1)}
          </div>
        </div>
      </div>

      {/* Route Details */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="flex flex-col items-center p-2 bg-slate-grey/20 rounded-lg">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Zap className="h-3 w-3 mr-1" />
            <span>Gas Cost</span>
          </div>
          <div className="text-sm font-bold text-neon-green">{recommendation.gasCost} ETH</div>
        </div>
        <div className="flex flex-col items-center p-2 bg-slate-grey/20 rounded-lg">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>ETA</span>
          </div>
          <div className="text-sm font-bold text-electric-blue">~{recommendation.estimatedTime} mins</div>
        </div>
        <div className="flex flex-col items-center p-2 bg-slate-grey/20 rounded-lg">
          <div className="flex items-center text-xs text-gray-400 mb-1">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>Risk</span>
          </div>
          <div className={`text-sm font-bold ${getRiskColor(recommendation.riskLevel)}`}>
            {recommendation.riskLevel}
          </div>
        </div>
      </div>

      {/* Transfer Amount */}
      <div className="bg-slate-grey/20 p-2 rounded-lg mb-4 text-center">
        <div className="text-xs text-gray-400 mb-1">Transfer Amount</div>
        <div className="text-lg font-bold text-white">
          {recommendation.amount} {recommendation.token}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <Button onClick={onLaunch} className="flex-1 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white">
          <Rocket className="h-4 w-4 mr-2" />
          Launch Mission
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <Button
          onClick={onSave}
          variant="outline"
          className="border-electric-blue text-electric-blue hover:bg-electric-blue/10"
        >
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
