"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Loader, ArrowRight } from "lucide-react"
import type { LaunchState } from "./launchpad-interface"
import { useRouter } from "next/navigation"

interface LaunchStatusBoxProps {
  launchState: LaunchState
  success: boolean | null
  sourceChain: string
  targetChain: string
  amount: string
  token: string
  onClose: () => void
}

export function LaunchStatusBox({
  launchState,
  success,
  sourceChain,
  targetChain,
  amount,
  token,
  onClose,
}: LaunchStatusBoxProps) {
  const router = useRouter()

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

  const getStatusContent = () => {
    switch (launchState) {
      case "launching":
        return {
          title: "Launching Mission",
          description: `Preparing to transfer ${amount} ${token} from ${sourceChain} to ${targetChain}...`,
          icon: <Loader className="h-12 w-12 text-electric-blue animate-spin" />,
        }
      case "traveling":
        return {
          title: "Mission In Progress",
          description: "Your tokens are traveling through the interstellar bridge...",
          icon: <Loader className="h-12 w-12 text-cosmic-purple animate-spin" />,
        }
      case "completed":
        return {
          title: "Mission Successful!",
          description: `Successfully transferred ${amount} ${token} from ${sourceChain} to ${targetChain}.`,
          icon: <CheckCircle className="h-12 w-12 text-neon-green" />,
        }
      case "failed":
        return {
          title: "Mission Failed",
          description: "There was an issue with your transfer. Please try again.",
          icon: <AlertCircle className="h-12 w-12 text-red-500" />,
        }
      default:
        return {
          title: "Preparing Mission",
          description: "Getting ready for launch...",
          icon: <Loader className="h-12 w-12 text-electric-blue animate-spin" />,
        }
    }
  }

  const content = getStatusContent()

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-md border border-electric-blue/30 text-white max-w-md">
        <div className="flex flex-col items-center text-center py-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="mb-4"
          >
            {content.icon}
          </motion.div>

          <h2 className="text-2xl font-bold mb-2 font-orbitron neon-text">{content.title}</h2>
          <p className="text-gray-300 mb-6">{content.description}</p>

          {/* Progress Timeline */}
          {(launchState === "launching" || launchState === "traveling") && (
            <div className="w-full mb-6">
              <div className="flex justify-between mb-2">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-neon-green flex items-center justify-center mb-1">
                    <CheckCircle className="h-4 w-4 text-black" />
                  </div>
                  <span className="text-xs text-gray-400">Initiated</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${
                      launchState === "traveling" ? "bg-neon-green" : "bg-gray-700"
                    } flex items-center justify-center mb-1`}
                  >
                    {launchState === "traveling" ? (
                      <CheckCircle className="h-4 w-4 text-black" />
                    ) : (
                      <span className="text-white">2</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">In Transit</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mb-1">
                    <span className="text-white">3</span>
                  </div>
                  <span className="text-xs text-gray-400">Completed</span>
                </div>
              </div>
              <div className="relative h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-neon-green"
                  initial={{ width: "0%" }}
                  animate={{
                    width: launchState === "launching" ? "33%" : launchState === "traveling" ? "66%" : "100%",
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          )}

          {/* Route Visualization */}
          {(launchState === "launching" || launchState === "traveling" || launchState === "completed") && (
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-1">{getChainIcon(sourceChain)}</div>
                <div className="text-sm">{sourceChain}</div>
              </div>
              <div className="flex-1 relative h-0.5 bg-gray-700 max-w-24">
                <AnimatePresence>
                  {launchState === "traveling" && (
                    <motion.div
                      className="absolute -top-2 text-lg"
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      exit={{ left: "100%" }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    >
                      🚀
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div
                  className="absolute top-0 left-0 h-full bg-electric-blue"
                  initial={{ width: "0%" }}
                  animate={{
                    width:
                      launchState === "launching"
                        ? "10%"
                        : launchState === "traveling"
                          ? "50%"
                          : launchState === "completed"
                            ? "100%"
                            : "0%",
                  }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-1">{getChainIcon(targetChain)}</div>
                <div className="text-sm">{targetChain}</div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {launchState === "completed" && (
              <>
                <Button
                  variant="outline"
                  className="border-electric-blue text-electric-blue hover:bg-electric-blue/10"
                  onClick={onClose}
                >
                  New Mission
                </Button>
                <Button
                  className="bg-neon-green hover:bg-neon-green/80 text-black"
                  onClick={() => router.push("/dashboard")}
                >
                  View Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}

            {launchState === "failed" && (
              <>
                <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-800" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="bg-electric-blue hover:bg-electric-blue/80 text-black" onClick={onClose}>
                  Try Again
                </Button>
              </>
            )}

            {(launchState === "launching" || launchState === "traveling") && (
              <Button variant="outline" className="border-gray-600 text-gray-400 hover:bg-gray-800" onClick={onClose}>
                Minimize
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
