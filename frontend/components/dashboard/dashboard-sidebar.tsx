"use client"

import { motion } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Rocket, Filter, Clock, Activity } from "lucide-react"
import type { UserStats as UserStatsType } from "@/types/dashboard"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardSidebarProps {
  stats?: UserStatsType
  isLoading: boolean
  filters: {
    chain: string
    status: string
    timeRange: string
  }
  onFilterChange: (filters: Partial<{ chain: string; status: string; timeRange: string }>) => void
}

export function DashboardSidebar({ stats, isLoading, filters, onFilterChange }: DashboardSidebarProps) {
  const chains = [
    { value: "all", label: "All Chains" },
    { value: "ethereum", label: "Ethereum" },
    { value: "arbitrum", label: "Arbitrum" },
    { value: "polygon", label: "Polygon" },
    { value: "optimism", label: "Optimism" },
    { value: "base", label: "Base" },
  ]

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
  ]

  const timeRanges = [
    { value: "all", label: "All Time" },
    { value: "week", label: "Past Week" },
    { value: "month", label: "Past Month" },
    { value: "year", label: "Past Year" },
  ]

  return (
    <div className="space-y-6">
      {/* User Profile Summary */}
      <motion.div
        className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-electric-blue/30 flex items-center justify-center">
            <Rocket className="h-6 w-6 text-electric-blue" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Pilot Status</h3>
            {isLoading ? (
              <Skeleton className="h-4 w-24 bg-slate-grey/40" />
            ) : (
              <p className="text-sm text-electric-blue font-tech">{stats?.rank || "Cadet"}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Missions</span>
            {isLoading ? (
              <Skeleton className="h-4 w-12 bg-slate-grey/40" />
            ) : (
              <span className="text-white font-tech">{stats?.totalMissions || 0}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Success Rate</span>
            {isLoading ? (
              <Skeleton className="h-4 w-16 bg-slate-grey/40" />
            ) : (
              <span className="text-neon-green font-tech">{stats?.successRate || "0%"}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Achievements</span>
            {isLoading ? (
              <Skeleton className="h-4 w-12 bg-slate-grey/40" />
            ) : (
              <span className="text-cosmic-purple font-tech">{stats?.achievementsCount || 0}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-4 w-4 text-electric-blue" />
          <h3 className="text-lg font-bold text-white">Mission Filters</h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Chain</label>
            <Select value={filters.chain} onValueChange={(value) => onFilterChange({ chain: value })}>
              <SelectTrigger className="bg-black/60 border-electric-blue/30">
                <SelectValue placeholder="Select Chain" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-electric-blue/30">
                {chains.map((chain) => (
                  <SelectItem key={chain.value} value={chain.value}>
                    {chain.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Status</label>
            <Select value={filters.status} onValueChange={(value) => onFilterChange({ status: value })}>
              <SelectTrigger className="bg-black/60 border-electric-blue/30">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-electric-blue/30">
                {statuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Time Range</label>
            <Select value={filters.timeRange} onValueChange={(value) => onFilterChange({ timeRange: value })}>
              <SelectTrigger className="bg-black/60 border-electric-blue/30">
                <SelectValue placeholder="Select Time Range" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-electric-blue/30">
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        className="bg-slate-grey/20 rounded-lg border border-cosmic-purple/20 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Activity className="h-4 w-4 text-cosmic-purple" />
          <h3 className="text-lg font-bold text-white">Quick Stats</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Gas Saved</span>
            {isLoading ? (
              <Skeleton className="h-4 w-20 bg-slate-grey/40" />
            ) : (
              <span className="text-neon-green font-tech">{stats?.gasSaved || "0 ETH"}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Value Bridged</span>
            {isLoading ? (
              <Skeleton className="h-4 w-24 bg-slate-grey/40" />
            ) : (
              <span className="text-electric-blue font-tech">{stats?.valueBridged || "$0"}</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Last Mission</span>
            {isLoading ? (
              <Skeleton className="h-4 w-28 bg-slate-grey/40" />
            ) : (
              <span className="text-white font-tech">{stats?.lastMission || "Never"}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Time Indicator */}
      <motion.div
        className="bg-slate-grey/20 rounded-lg border border-neon-green/20 p-4 flex items-center space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Clock className="h-5 w-5 text-neon-green" />
        <div>
          <div className="text-xs text-gray-400">Galactic Time</div>
          <div className="text-sm text-white font-tech">{new Date().toLocaleTimeString()}</div>
        </div>
      </motion.div>
    </div>
  )
}
