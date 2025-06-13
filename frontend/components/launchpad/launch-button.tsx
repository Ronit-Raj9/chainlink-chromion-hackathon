"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Rocket, Zap, Loader } from "lucide-react"
import type { LaunchState } from "./launchpad-interface"

interface LaunchButtonProps {
  isReady: boolean
  launchState: LaunchState
  onLaunch: () => void
}

export function LaunchButton({ isReady, launchState, onLaunch }: LaunchButtonProps) {
  const getButtonContent = () => {
    switch (launchState) {
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
          icon: <Loader className="h-5 w-5 animate-spin" />,
          disabled: true,
        }
      case "traveling":
        return {
          text: "🛸 IN TRANSIT...",
          icon: <Loader className="h-5 w-5 animate-spin" />,
          disabled: true,
        }
      case "completed":
        return {
          text: "✅ MISSION COMPLETE",
          icon: <Rocket className="h-5 w-5" />,
          disabled: true,
        }
      case "failed":
        return {
          text: "❌ MISSION FAILED",
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
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
    >
      <Button
        onClick={onLaunch}
        disabled={buttonContent.disabled}
        className={`px-8 py-6 text-lg font-bold font-orbitron transition-all duration-300 ${
          isReady && launchState === "configuring"
            ? "bg-gradient-to-r from-electric-blue to-cosmic-purple hover:from-cosmic-purple hover:to-electric-blue text-black neon-glow animate-pulse-neon"
            : launchState === "launching" || launchState === "traveling"
              ? "bg-gradient-to-r from-neon-green/80 to-electric-blue/80 text-black"
              : launchState === "completed"
                ? "bg-gradient-to-r from-neon-green to-neon-green/80 text-black"
                : launchState === "failed"
                  ? "bg-gradient-to-r from-red-500 to-red-700 text-white"
                  : "bg-slate-grey/40 text-gray-400 border-gray-600"
        }`}
      >
        <motion.div
          className="flex items-center space-x-2"
          animate={launchState === "launching" || launchState === "traveling" ? { scale: [1, 1.05, 1] } : {}}
          transition={
            launchState === "launching" || launchState === "traveling"
              ? { duration: 0.5, repeat: Number.POSITIVE_INFINITY }
              : {}
          }
        >
          {buttonContent.icon}
          <span>{buttonContent.text}</span>
        </motion.div>
      </Button>

      {/* Charging Effect */}
      {isReady && launchState === "configuring" && (
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
