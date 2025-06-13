"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle, Clock, X, ExternalLink, Star, Edit } from "lucide-react"
import type { Mission } from "@/types/dashboard"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"

interface MissionDetailModalProps {
  mission: Mission
  onClose: () => void
}

export function MissionDetailModal({ mission, onClose }: MissionDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [missionName, setMissionName] = useState(mission.name)
  const [isStarred, setIsStarred] = useState(mission.isStarred || false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
            <Clock className="h-3 w-3 mr-1" />
            Unknown
          </Badge>
        )
    }
  }

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

  const handleSave = () => {
    // In a real app, this would save to the backend
    setIsEditing(false)
    // For now we just update the local state
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 backdrop-blur-md border border-electric-blue/30 text-white max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-orbitron neon-text">Mission Details</DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mission Name */}
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex-1 flex items-center space-x-2">
                <Input
                  value={missionName}
                  onChange={(e) => setMissionName(e.target.value)}
                  className="bg-black/60 border-electric-blue/30 text-white"
                  autoFocus
                />
                <Button size="sm" onClick={handleSave} className="bg-electric-blue text-black">
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <span>{missionName}</span>
                  <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white">
                    <Edit className="h-4 w-4" />
                  </button>
                </h3>
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className={`${
                    isStarred ? "text-yellow-400" : "text-gray-500"
                  } hover:text-yellow-400 transition-colors`}
                >
                  <Star className="h-5 w-5" fill={isStarred ? "currentColor" : "none"} />
                </button>
              </>
            )}
          </div>

          {/* Route Visualization */}
          <div className="bg-slate-grey/20 rounded-lg p-6 flex flex-col items-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">{getChainIcon(mission.fromChain)}</div>
                <div className="text-sm font-bold">{mission.fromChain}</div>
                <div className="text-xs text-gray-400">Source</div>
              </div>

              <motion.div
                className="flex-1 h-1 bg-gradient-to-r from-electric-blue to-cosmic-purple relative"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
              >
                <motion.div
                  className="absolute -top-2 text-lg"
                  initial={{ left: "0%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1 }}
                >
                  🚀
                </motion.div>
              </motion.div>

              <div className="flex flex-col items-center">
                <div className="text-4xl mb-2">{getChainIcon(mission.toChain)}</div>
                <div className="text-sm font-bold">{mission.toChain}</div>
                <div className="text-xs text-gray-400">Destination</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold font-tech mb-1">
                {mission.amount} {mission.token}
              </div>
              <div className="text-sm text-gray-400">Transferred Amount</div>
            </div>
          </div>

          {/* Mission Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-grey/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Status</h4>
              <div>{getStatusBadge(mission.status)}</div>
            </div>

            <div className="bg-slate-grey/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Date & Time</h4>
              <div className="font-tech">{mission.date}</div>
            </div>

            <div className="bg-slate-grey/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Gas Saved</h4>
              <div className="text-neon-green font-tech">{mission.gasSaved}</div>
            </div>

            <div className="bg-slate-grey/20 rounded-lg p-4">
              <h4 className="text-sm text-gray-400 mb-2">Transaction Hash</h4>
              <a
                href={`https://etherscan.io/tx/${mission.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-electric-blue hover:text-white transition-colors"
              >
                <span className="font-tech truncate">{mission.txHash}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="font-bold">Mission Timeline</h4>
            <div className="space-y-2">
              {mission.timeline?.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`mt-1 h-3 w-3 rounded-full ${
                      index === mission.timeline.length - 1
                        ? "bg-neon-green"
                        : index === 0
                          ? "bg-electric-blue"
                          : "bg-cosmic-purple"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div className="font-bold">{event.title}</div>
                      <div className="text-sm text-gray-400 font-tech">{event.time}</div>
                    </div>
                    <div className="text-sm text-gray-400">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/10">
              View on Explorer
            </Button>
            <Button className="bg-electric-blue hover:bg-electric-blue/80 text-black">Repeat Mission</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
