"use client"

import { motion } from "framer-motion"
import { Users } from "lucide-react"
import type { Participant } from "@/types/launchpad"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ParticipantsPanelProps {
  participants: Participant[]
}

export function ParticipantsPanel({ participants }: ParticipantsPanelProps) {
  return (
    <motion.div
      className="bg-slate-grey/20 backdrop-blur-md rounded-lg border border-cosmic-purple/30 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <Users className="h-4 w-4 text-cosmic-purple" />
        <h3 className="text-lg font-bold neon-text font-orbitron">FELLOW TRAVELERS</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {participants.map((participant, index) => (
          <motion.div
            key={participant.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 500, damping: 30 }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border-2 ${
                      participant.status === "ready"
                        ? "bg-neon-green/20 border-neon-green text-neon-green"
                        : "bg-yellow-500/20 border-yellow-500 text-yellow-500"
                    }`}
                  >
                    {participant.avatar || participant.name.substring(0, 2).toUpperCase()}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <div className="font-bold">{participant.name}</div>
                    <div className="text-xs text-gray-400">
                      {participant.status === "ready" ? "Ready to launch" : "Preparing for launch"}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        ))}

        {/* Empty seats */}
        {Array.from({ length: Math.max(0, 10 - participants.length) }).map((_, index) => (
          <motion.div
            key={`empty-${index}`}
            className="w-10 h-10 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-600"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ delay: (participants.length + index) * 0.1, type: "spring", stiffness: 500, damping: 30 }}
          >
            +
          </motion.div>
        ))}
      </div>

      <div className="mt-3 text-center text-sm text-gray-400 font-tech">
        {participants.length < 10
          ? `${10 - participants.length} more seats available`
          : "All seats filled, ready for launch!"}
      </div>
    </motion.div>
  )
}
