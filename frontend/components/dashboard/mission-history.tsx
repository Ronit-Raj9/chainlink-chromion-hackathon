"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { MissionDetailModal } from "./mission-detail-modal"
import { ExternalLink, CheckCircle, AlertCircle, Clock, ArrowRight, Search } from "lucide-react"
import type { Mission } from "@/types/dashboard"
import { Input } from "@/components/ui/input"

interface MissionHistoryProps {
  missions?: Mission[]
  isLoading: boolean
  error?: string
}

export function MissionHistory({ missions, isLoading, error }: MissionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)

  // Filter missions by search query
  const filteredMissions = missions?.filter(
    (mission) =>
      mission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.fromChain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.toChain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mission.token.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  return (
    <div className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold neon-text font-orbitron">Mission History</h3>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search missions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-black/40 border-electric-blue/30 text-white placeholder-gray-500"
          />
        </div>
      </div>

      {isLoading ? (
        // Loading skeletons
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-black/40 rounded-lg border border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full bg-slate-grey/40" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-slate-grey/40" />
                    <Skeleton className="h-3 w-24 bg-slate-grey/40" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full bg-slate-grey/40" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-40 bg-slate-grey/40" />
                <Skeleton className="h-4 w-28 bg-slate-grey/40" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Error state
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-white mb-2">Failed to load missions</h4>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button variant="outline" className="border-electric-blue text-electric-blue hover:bg-electric-blue/10">
            Try Again
          </Button>
        </div>
      ) : filteredMissions && filteredMissions.length > 0 ? (
        // Mission list
        <div className="space-y-4">
          <AnimatePresence>
            {filteredMissions.map((mission, index) => (
              <motion.div
                key={mission.id}
                className="p-4 bg-black/40 rounded-lg border border-cosmic-purple/20 hover:border-cosmic-purple/40 transition-all cursor-pointer"
                onClick={() => setSelectedMission(mission)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{getChainIcon(mission.fromChain)}</span>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <span className="text-xl">{getChainIcon(mission.toChain)}</span>
                    </div>
                    <div>
                      <div className="font-bold text-white">{mission.name}</div>
                      <div className="text-sm text-gray-400">
                        {mission.fromChain} → {mission.toChain} • {mission.date}
                      </div>
                    </div>
                  </div>

                  <div>{getStatusBadge(mission.status)}</div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-400">Amount: </span>
                    <span className="text-white font-tech">
                      {mission.amount} {mission.token}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-neon-green">Saved {mission.gasSaved}</div>
                    <button className="flex items-center space-x-1 text-electric-blue hover:text-white transition-colors text-sm">
                      <span className="font-tech">{mission.txHash.substring(0, 10)}...</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        // Empty state
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h4 className="text-lg font-bold text-white mb-2">No Missions Yet</h4>
          <p className="text-gray-400 mb-6">Launch your first interstellar journey to see it here</p>
          <Button className="bg-electric-blue hover:bg-electric-blue/80 text-black font-bold">
            Launch First Mission
          </Button>
        </div>
      )}

      {/* Mission Detail Modal */}
      {selectedMission && <MissionDetailModal mission={selectedMission} onClose={() => setSelectedMission(null)} />}
    </div>
  )
}
