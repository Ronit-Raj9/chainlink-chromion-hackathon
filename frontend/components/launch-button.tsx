"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Rocket, Zap } from "lucide-react"
import type { BridgeState } from "./mission-control"

interface LaunchButtonProps {
  isReady: boolean
  bridgeState: BridgeState
  onLaunch: () => void
}

export function LaunchButton({ isReady, bridgeState, onLaunch }: LaunchButtonProps) {
  const getButtonContent = () => {
    switch (bridgeState) {
      case "idle":
        return {
          text: "Configure Mission Parameters",
          icon: <Zap className="h-5 w-5" />,
          disabled: true,
        }
      case "configuring":
        return {
          text: isReady ? "🚀 INITIATE LAUNCH SEQUENCE" : "Complete Configuration",
          icon: <Rocket className="h-5 w-5" />,
          disabled: !isReady,
        }
      case "launching":
        return {
          text: "🔥 LAUNCHING...",
          icon: <Rocket className="h-5 w-5" />,
          disabled: true,
        }
      case "traveling":
        return {
          text: "🛸 IN TRANSIT...",
          icon: <Rocket className="h-5 w-5" />,
          disabled: true,
        }
      case "landing":
        return {
          text: "🪐 LANDING...",
          icon: <Rocket className="h-5 w-5" />,
          disabled: true,
        }
      case "completed":
        return {
          text: "✅ MISSION COMPLETE",
          icon: <Rocket className="h-5 w-5" />,
          disabled: true,
        }
      default:
        return {
          text: "Configure Mission",
          icon: <Zap className="h-5 w-5" />,
          disabled: true,
        }
    }
  }

  const buttonContent = getButtonContent()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
      <Button
        onClick={onLaunch}
        disabled={buttonContent.disabled}
        className={`px-8 py-4 text-lg font-bold font-orbitron transition-all duration-300 ${
          isReady && bridgeState === "configuring"
            ? "bg-gradient-to-r from-electric-blue to-cosmic-purple hover:from-cosmic-purple hover:to-electric-blue text-black neon-glow animate-pulse-neon"
            : bridgeState === "launching" || bridgeState === "traveling" || bridgeState === "landing"
              ? "bg-gradient-to-r from-neon-green/80 to-electric-blue/80 text-black"
              : bridgeState === "completed"
                ? "bg-gradient-to-r from-neon-green to-neon-green/80 text-black"
                : "bg-slate-grey/40 text-gray-400 border-gray-600"
        }`}
      >
        <motion.div
          className="flex items-center space-x-2"
          animate={bridgeState === "launching" || bridgeState === "traveling" ? { scale: [1, 1.05, 1] } : {}}
          transition={
            bridgeState === "launching" || bridgeState === "traveling"
              ? { duration: 0.5, repeat: Number.POSITIVE_INFINITY }
              : {}
          }
        >
          {buttonContent.icon}
          <span>{buttonContent.text}</span>
        </motion.div>
      </Button>

      {/* Charging Effect */}
      {isReady && bridgeState === "configuring" && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-electric-blue/20 to-cosmic-purple/20"
          animate={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.div>
  )
}
