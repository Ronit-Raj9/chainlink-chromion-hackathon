"use client"

import { motion } from "framer-motion"

type LaunchState = "idle" | "configuring" | "creating" | "launching" | "traveling" | "completed" | "failed"

interface LaunchButtonProps {
  isReady: boolean
  launchState: LaunchState
  onLaunch: () => void
  isPending?: boolean
}

export default function LaunchButton({ isReady, launchState, onLaunch, isPending }: LaunchButtonProps) {
  
  const getButtonText = () => {
    if (isPending) return "⏳ TRANSACTION PENDING..."
    
    switch (launchState) {
      case "idle":
        return "📋 Configure Mission Parameters"
      case "configuring":
        return "🚀 INITIATE LAUNCH SEQUENCE"
      case "creating":
        return "🛠️ CREATING STARSHIP..."
      case "launching":
        return "🔥 LAUNCHING..."
      case "traveling":
        return "🛸 IN TRANSIT..."
      case "completed":
        return "✅ MISSION COMPLETE"
      case "failed":
        return "❌ MISSION FAILED"
      default:
        return "📋 Configure Mission Parameters"
    }
  }

  const getButtonStyle = () => {
    if (isPending) {
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white cursor-not-allowed animate-pulse"
    }
    
    if (!isReady && launchState !== "configuring") {
      return "bg-gray-600/40 text-gray-400 cursor-not-allowed"
    }
    
    switch (launchState) {
      case "configuring":
        return "bg-gradient-to-r from-electric-blue to-neon-cyan hover:from-electric-blue/80 hover:to-neon-cyan/80 text-white cursor-pointer neon-glow"
      case "creating":
        return "bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-not-allowed animate-pulse"
      case "launching":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white cursor-not-allowed animate-pulse"
      case "traveling":
        return "bg-gradient-to-r from-cosmic-purple to-electric-blue text-white cursor-not-allowed animate-pulse"
      case "completed":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white cursor-not-allowed"
      case "failed":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white cursor-not-allowed"
      default:
        return "bg-gray-600/40 text-gray-400 cursor-not-allowed"
    }
  }

  const isClickable = () => {
    return isReady && launchState === "configuring" && !isPending
  }

  const handleClick = () => {
    if (isClickable()) {
      console.log("🚀 Launch button clicked!")
      onLaunch()
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={!isClickable()}
      className={`
        relative px-12 py-4 rounded-lg font-bold text-lg font-orbitron
        transition-all duration-300 transform min-w-[300px]
        ${getButtonStyle()}
        ${isClickable() ? "hover:scale-105 active:scale-95" : ""}
      `}
      whileHover={isClickable() ? { scale: 1.05 } : {}}
      whileTap={isClickable() ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Button Text */}
      <span className="relative z-10">
        {getButtonText()}
      </span>

      {/* Loading Animation for launching states */}
      {(isPending || launchState === "creating" || launchState === "launching" || launchState === "traveling") && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
          animate={{ x: [-300, 300] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Glow effect for ready state */}
      {isClickable() && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-electric-blue/30 to-neon-cyan/30 rounded-lg blur-xl"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  )
} 