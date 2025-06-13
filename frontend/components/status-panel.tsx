"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Clock, Rocket, Zap, Target } from "lucide-react"
import type { BridgeState, BridgeConfig } from "./mission-control"

interface StatusPanelProps {
  bridgeState: BridgeState
  config: BridgeConfig
}

export function StatusPanel({ bridgeState, config }: StatusPanelProps) {
  const getStatusSteps = () => {
    const steps = [
      {
        id: "configure",
        label: "Mission Configuration",
        icon: <Zap className="h-4 w-4" />,
        active: bridgeState !== "idle",
        completed: bridgeState !== "idle" && bridgeState !== "configuring",
      },
      {
        id: "launch",
        label: "Rocket Launch Initiated",
        icon: <Rocket className="h-4 w-4" />,
        active:
          bridgeState === "launching" ||
          bridgeState === "traveling" ||
          bridgeState === "landing" ||
          bridgeState === "completed",
        completed: bridgeState === "traveling" || bridgeState === "landing" || bridgeState === "completed",
      },
      {
        id: "ccip",
        label: "Chainlink CCIP Message Sent",
        icon: <Clock className="h-4 w-4" />,
        active: bridgeState === "traveling" || bridgeState === "landing" || bridgeState === "completed",
        completed: bridgeState === "landing" || bridgeState === "completed",
      },
      {
        id: "landing",
        label: "Destination Chain Confirmed",
        icon: <Target className="h-4 w-4" />,
        active: bridgeState === "landing" || bridgeState === "completed",
        completed: bridgeState === "completed",
      },
      {
        id: "complete",
        label: "Tokens Delivered Successfully",
        icon: <CheckCircle className="h-4 w-4" />,
        active: bridgeState === "completed",
        completed: bridgeState === "completed",
      },
    ]

    return steps
  }

  const shouldShowPanel = bridgeState !== "idle"

  return (
    <AnimatePresence>
      {shouldShowPanel && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="mt-12"
        >
          <div className="bg-black/60 backdrop-blur-md rounded-lg border border-electric-blue/30 p-6">
            <h3 className="text-xl font-bold mb-6 text-center neon-text font-orbitron">🛰️ MISSION STATUS TIMELINE</h3>

            <div className="space-y-4">
              {getStatusSteps().map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`flex items-center space-x-4 p-3 rounded-lg transition-all ${
                    step.active
                      ? step.completed
                        ? "bg-neon-green/10 border border-neon-green/30"
                        : "bg-electric-blue/10 border border-electric-blue/30"
                      : "bg-slate-grey/20 border border-gray-600"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`p-2 rounded-full ${
                      step.completed
                        ? "bg-neon-green text-black"
                        : step.active
                          ? "bg-electric-blue text-black animate-pulse"
                          : "bg-gray-600 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>

                  <div className="flex-1">
                    <div
                      className={`font-bold font-tech ${
                        step.completed ? "text-neon-green" : step.active ? "text-electric-blue" : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </div>
                    {step.active && !step.completed && <div className="text-xs text-gray-400 mt-1">Processing...</div>}
                    {step.completed && <div className="text-xs text-neon-green mt-1">✓ Complete</div>}
                  </div>

                  {step.active && !step.completed && (
                    <motion.div
                      className="w-2 h-2 bg-electric-blue rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Live Stats */}
            {config.amount && config.sourceChain && config.targetChain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-cosmic-purple/10 rounded-lg border border-cosmic-purple/30"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-electric-blue font-tech">
                      {config.amount} {config.token}
                    </div>
                    <div className="text-xs text-gray-400">Payload</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-neon-green font-tech">0.008 ETH</div>
                    <div className="text-xs text-gray-400">Gas Saved</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cosmic-purple font-tech">
                      {bridgeState === "completed" ? "0s" : "~15s"}
                    </div>
                    <div className="text-xs text-gray-400">ETA</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-400 font-tech">CCIP</div>
                    <div className="text-xs text-gray-400">Security</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
