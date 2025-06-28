"use client"

import { motion } from "framer-motion"

type LaunchState = "idle" | "configuring" | "creating" | "launching" | "traveling" | "completed" | "failed"

interface RocketAnimationProps {
  launchState: LaunchState
}

export default function RocketAnimation({ launchState }: RocketAnimationProps) {
  const getRocketAnimation = () => {
    switch (launchState) {
      case "idle":
        return {
          y: [0, -10, 0],
          rotate: 0,
          scale: 1,
          transition: { duration: 3, repeat: Infinity },
        }
      case "configuring":
        return {
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0],
          scale: 1.05,
          transition: { duration: 2, repeat: Infinity },
        }
      case "launching":
        return {
          y: [0, -20, -40],
          rotate: [0, -5, 5, 0],
          scale: 1.2,
          transition: { duration: 2 },
        }
      case "traveling":
        return {
          y: [-40, -60, -40],
          rotate: [0, 10, -10, 0],
          scale: [1.2, 1, 1.2],
          transition: { duration: 3, repeat: Infinity },
        }
      case "completed":
        return {
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { duration: 1 },
        }
      case "failed":
        return {
          y: [0, -10, 10, 0],
          rotate: [0, -15, 15, 0],
          scale: 0.9,
          transition: { duration: 2 },
        }
      default:
        return {
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { duration: 1 },
        }
    }
  }

  const showFlames = launchState === "launching" || launchState === "traveling"
  const showParticles = launchState === "launching" || launchState === "failed"

  return (
    <div className="relative h-32 w-32 flex items-center justify-center">
      {/* Particle Effects */}
      {showParticles && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-electric-blue/30 to-transparent"></div>
        </motion.div>
      )}

      {/* Main Rocket */}
      <motion.div 
        className="relative z-10"
        animate={getRocketAnimation()}
      >
        {/* Rocket Emoji */}
        <div className="text-6xl">🚀</div>

        {/* Rocket Flames */}
        {showFlames && (
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 0.2, repeat: Infinity }}
          >
            <div className="text-2xl">🔥</div>
          </motion.div>
        )}
      </motion.div>

      {/* Glow Effect */}
      {(launchState === "configuring" || launchState === "launching") && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-electric-blue/20 to-cosmic-purple/20 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Success Glow */}
      {launchState === "completed" && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  )
} 