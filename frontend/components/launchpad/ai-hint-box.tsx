"use client"

import { motion } from "framer-motion"
import { Bot, X } from "lucide-react"

interface AIHintBoxProps {
  sourceChain: string
  targetChain: string
  onClose: () => void
  suggestRetry: boolean
}

export function AIHintBox({ sourceChain, targetChain, onClose, suggestRetry }: AIHintBoxProps) {
  const getHint = () => {
    if (suggestRetry) {
      return "I noticed your last mission failed. Would you like to retry with the same parameters? I've prefilled them for you."
    }

    if (!sourceChain && !targetChain) {
      return "Select your source and destination worlds to begin your interstellar journey."
    }

    if (sourceChain && !targetChain) {
      return `Great choice with ${sourceChain}! Now select your destination world to continue.`
    }

    if (sourceChain && targetChain) {
      // Chain-specific tips
      if (sourceChain === "arbitrum" && targetChain === "ethereum") {
        return "Arbitrum to Ethereum is currently experiencing low gas fees. Perfect timing for your mission!"
      }

      if (sourceChain === "optimism" && targetChain === "ethereum") {
        return "For Optimism to Ethereum transfers, consider batching multiple tokens to maximize gas savings."
      }

      return `The ${sourceChain} to ${targetChain} route is ready for your mission parameters. Current gas savings are optimal!`
    }

    return "I'm your AI mission assistant. How can I help optimize your interstellar journey today?"
  }

  return (
    <motion.div
      className="bg-black/60 backdrop-blur-md rounded-lg border border-cosmic-purple/30 p-4 w-full max-w-md relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        aria-label="Close hint"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cosmic-purple/30 flex items-center justify-center">
          <Bot className="h-4 w-4 text-cosmic-purple" />
        </div>
        <div>
          <div className="text-xs text-cosmic-purple mb-1 font-tech">AI MISSION ASSISTANT</div>
          <p className="text-sm text-white">{getHint()}</p>
        </div>
      </div>
    </motion.div>
  )
}
