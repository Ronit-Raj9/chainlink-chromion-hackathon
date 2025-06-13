"use client"

import { motion } from "framer-motion"
import type { BridgeState } from "./mission-control"

interface RocketVisualProps {
  bridgeState: BridgeState
  sourceChain: string
  targetChain: string
}

export function RocketVisual({ bridgeState, sourceChain, targetChain }: RocketVisualProps) {
  const getRocketAnimation = () => {
    switch (bridgeState) {
      case "idle":
        return {
          y: [0, -10, 0],
          rotate: 0,
          scale: 1,
          transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }
      case "configuring":
        return {
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0],
          scale: 1.05,
          transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }
      case "launching":
        return {
          y: [0, -20, -40],
          rotate: 0,
          scale: [1, 1.1, 1.2],
          transition: { duration: 2, ease: "easeOut" },
        }
      case "traveling":
        return {
          x: [-200, 200],
          y: [-40, -60, -40],
          rotate: [0, 15, -15, 0],
          scale: [1.2, 0.8, 1.2],
          transition: { duration: 3, ease: "easeInOut" },
        }
      case "landing":
        return {
          x: 200,
          y: [0, 10, 0],
          rotate: 0,
          scale: [1.2, 1],
          transition: { duration: 2, ease: "easeInOut" },
        }
      case "completed":
        return {
          x: 200,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { duration: 1 },
        }
      default:
        return {}
    }
  }

  const getFlameAnimation = () => {
    if (bridgeState === "launching" || bridgeState === "traveling") {
      return {
        scale: [1, 1.5, 1],
        opacity: [0.8, 1, 0.8],
        transition: { duration: 0.2, repeat: Number.POSITIVE_INFINITY },
      }
    }
    return { scale: 0, opacity: 0 }
  }

  return (
    <div className="relative flex items-center justify-center h-64 w-full">
      {/* Rocket */}
      <motion.div className="relative z-10" animate={getRocketAnimation()}>
        <div className="text-8xl filter drop-shadow-lg">🚀</div>

        {/* Rocket Flames */}
        <motion.div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2" animate={getFlameAnimation()}>
          <div className="text-4xl">🔥</div>
        </motion.div>

        {/* Particle Trail */}
        {(bridgeState === "launching" || bridgeState === "traveling") && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.5,
            }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-radial from-electric-blue/30 to-transparent"></div>
          </motion.div>
        )}
      </motion.div>

      {/* Travel Path Visualization */}
      {sourceChain && targetChain && bridgeState === "traveling" && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="w-full h-full" viewBox="0 0 400 200">
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 50 100 Q 200 50 350 100"
              stroke="url(#pathGradient)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      )}

      {/* Status Indicators */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {["idle", "configuring", "launching", "traveling", "landing", "completed"].map((state, index) => (
            <motion.div
              key={state}
              className={`w-2 h-2 rounded-full ${bridgeState === state ? "bg-electric-blue" : "bg-gray-600"}`}
              animate={{
                scale: bridgeState === state ? [1, 1.5, 1] : 1,
                opacity: bridgeState === state ? [0.5, 1, 0.5] : 0.3,
              }}
              transition={{
                duration: 1,
                repeat: bridgeState === state ? Number.POSITIVE_INFINITY : 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
