"use client"

import { motion, useAnimation } from "framer-motion"
import { useEffect, useState } from "react"
import type { LaunchState } from "./launchpad-interface"

interface RocketAnimationProps {
  launchState: LaunchState
  sourceChain: string
  targetChain: string
}

export function RocketAnimation({ launchState, sourceChain, targetChain }: RocketAnimationProps) {
  const controls = useAnimation()
  const [rocketScale, setRocketScale] = useState(1)
  const [showParticles, setShowParticles] = useState(false)
  const [showFlames, setShowFlames] = useState(false)
  const [showTrail, setShowTrail] = useState(false)

  useEffect(() => {
    const animateRocket = async () => {
      switch (launchState) {
        case "idle":
          setShowParticles(false)
          setShowFlames(false)
          setShowTrail(false)
          setRocketScale(1)
          await controls.start({
            y: [0, -10, 0],
            rotate: 0,
            x: 0,
            transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          })
          break
        case "configuring":
          setShowParticles(false)
          setShowFlames(false)
          setShowTrail(false)
          setRocketScale(1.05)
          await controls.start({
            y: [0, -5, 0],
            rotate: [0, 2, -2, 0],
            x: 0,
            transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
          })
          break
        case "launching":
          setShowParticles(true)
          setShowFlames(true)
          setShowTrail(false)
          setRocketScale(1.2)
          // Shake and prepare for takeoff
          await controls.start({
            y: [0, -5, 5, -8, 8, -10],
            rotate: [0, -2, 2, -1, 1, 0],
            x: [0, -3, 3, -2, 2, 0],
            transition: { duration: 1.5, ease: "easeInOut" },
          })
          // Launch upward
          await controls.start({
            y: -100,
            rotate: 0,
            scale: 0.8,
            transition: { duration: 1.5, ease: "easeOut" },
          })
          break
        case "traveling":
          setShowParticles(true)
          setShowFlames(true)
          setShowTrail(true)
          // Move horizontally across the screen
          await controls.start({
            x: sourceChain && targetChain ? [-200, 200] : 0,
            y: [-100, -120, -100],
            rotate: [0, 5, -5, 0],
            scale: [0.8, 0.7, 0.8],
            transition: { duration: 3, ease: "easeInOut" },
          })
          break
        case "completed":
          setShowParticles(false)
          setShowFlames(false)
          setShowTrail(false)
          // Land at destination
          await controls.start({
            x: 200,
            y: 0,
            rotate: 0,
            scale: 1,
            transition: { duration: 1, ease: "easeOut" },
          })
          break
        case "failed":
          setShowParticles(true)
          setShowFlames(false)
          setShowTrail(false)
          // Shake and fall
          await controls.start({
            x: [0, -10, 10, -15, 15, -5, 5, 0],
            y: [0, -20, -10, 0, 10, 30, 60],
            rotate: [0, -15, 15, -30, 30, 45, 60],
            transition: { duration: 2, ease: "easeIn" },
          })
          break
        default:
          setShowParticles(false)
          setShowFlames(false)
          setShowTrail(false)
          await controls.start({
            y: 0,
            rotate: 0,
            x: 0,
            transition: { duration: 1 },
          })
      }
    }

    animateRocket()
  }, [launchState, controls, sourceChain, targetChain])

  return (
    <div className="relative h-64 w-full flex items-center justify-center">
      {/* Travel Path Visualization */}
      {sourceChain && targetChain && (launchState === "traveling" || launchState === "launching") && (
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
              animate={{ pathLength: launchState === "traveling" ? 1 : 0.2 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
      )}

      {/* Rocket */}
      <motion.div className="relative z-10" animate={controls} style={{ scale: rocketScale }}>
        {/* Particle Effects (pre-launch) */}
        {showParticles && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10"
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 0.2,
            }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-radial from-electric-blue/30 to-transparent"></div>
          </motion.div>
        )}

        {/* Rocket Body */}
        <div className="text-8xl filter drop-shadow-lg">🚀</div>

        {/* Rocket Flames */}
        {showFlames && (
          <motion.div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ duration: 0.2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-4xl">🔥</div>
          </motion.div>
        )}

        {/* Trail Effect */}
        {showTrail && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-electric-blue/30"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  x: -100 - i * 20,
                  y: 0,
                  scale: 1 - i * 0.15,
                  opacity: 0.8 - i * 0.15,
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
                style={{
                  width: `${20 - i * 2}px`,
                  height: `${20 - i * 2}px`,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Status Indicators */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {["idle", "configuring", "launching", "traveling", "completed", "failed"].map((state, index) => (
            <motion.div
              key={state}
              className={`w-2 h-2 rounded-full ${launchState === state ? "bg-electric-blue" : "bg-gray-600"}`}
              animate={{
                scale: launchState === state ? [1, 1.5, 1] : 1,
                opacity: launchState === state ? [0.5, 1, 0.5] : 0.3,
              }}
              transition={{
                duration: 1,
                repeat: launchState === state ? Number.POSITIVE_INFINITY : 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
