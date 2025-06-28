"use client"

import { motion } from "framer-motion"

type LaunchState = "idle" | "configuring" | "creating" | "launching" | "traveling" | "completed" | "failed"

interface MissionTimelineProps {
  launchState: LaunchState
  amount: string
  token: string
}

const timelineSteps = [
  {
    id: "configuration",
    title: "Mission Configuration",
    description: "Processing",
    icon: "⚙️"
  },
  {
    id: "launch",
    title: "Rocket Launch Initiated",
    description: "Launch sequence active",
    icon: "🚀"
  },
  {
    id: "ccip",
    title: "Chainlink CCIP Message Sent",
    description: "Cross-chain message transmitted",
    icon: "🔗"
  },
  {
    id: "destination",
    title: "Destination Chain Confirmed",
    description: "Target chain has received message",
    icon: "🎯"
  },
  {
    id: "complete",
    title: "Tokens Delivered Successfully",
    description: "Mission accomplished",
    icon: "✅"
  }
]

export default function MissionTimeline({ launchState, amount, token }: MissionTimelineProps) {
  
  const getCurrentStep = () => {
    switch (launchState) {
      case "launching":
        return 0 // Configuration
      case "traveling":
        return 2 // CCIP Message Sent
      case "completed":
        return 4 // All complete
      default:
        return 0
    }
  }

  const currentStep = getCurrentStep()

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "completed"
    if (index === currentStep) return "active"
    return "pending"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-effect rounded-2xl p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold neon-text font-orbitron mb-2">
          🌟 MISSION STATUS TIMELINE
        </h3>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-6">
        {timelineSteps.map((step, index) => {
          const status = getStepStatus(index)
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative flex items-center p-4 rounded-lg border-2 transition-all duration-500
                ${status === "completed" 
                  ? "bg-green-500/20 border-green-500/50" 
                  : status === "active"
                  ? "bg-electric-blue/20 border-electric-blue/50"
                  : "bg-gray-700/20 border-gray-600/50"
                }
              `}
            >
              {/* Step Icon */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl mr-4 border-2
                ${status === "completed"
                  ? "bg-green-500/30 border-green-500/70"
                  : status === "active"
                  ? "bg-electric-blue/30 border-electric-blue/70 animate-pulse"
                  : "bg-gray-600/30 border-gray-600/70"
                }
              `}>
                <span>{step.icon}</span>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <h4 className={`
                  font-bold text-lg font-orbitron
                  ${status === "completed" ? "text-green-400" : status === "active" ? "text-electric-blue" : "text-gray-400"}
                `}>
                  {step.title}
                </h4>
                <p className="text-gray-400 font-tech text-sm">
                  {step.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div className="ml-4">
                {status === "completed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    ✓
                  </motion.div>
                )}
                {status === "active" && (
                  <motion.div
                    className="w-6 h-6 bg-electric-blue rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {status === "pending" && (
                  <div className="w-6 h-6 border-2 border-gray-600 rounded-full" />
                )}
              </div>

              {/* Active Step Glow */}
              {status === "active" && (
                <motion.div
                  className="absolute inset-0 bg-electric-blue/10 rounded-lg blur-sm"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Transaction Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-gray-700"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-tech">
          <div>
            <div className="text-2xl font-bold text-neon-cyan">{amount || "0"} {token}</div>
            <div className="text-sm text-gray-400">Payload</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-cyan">0.003 ETH</div>
            <div className="text-sm text-gray-400">Gas Saved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-cyan">~15s</div>
            <div className="text-sm text-gray-400">ETA</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-neon-cyan">CCIP</div>
            <div className="text-sm text-gray-400">Security</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 