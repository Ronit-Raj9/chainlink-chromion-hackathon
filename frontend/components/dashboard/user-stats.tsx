"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import type { UserStats as UserStatsType } from "@/types/dashboard"

interface UserStatsProps {
  stats?: UserStatsType
  isLoading: boolean
}

export function UserStats({ stats, isLoading }: UserStatsProps) {
  const [animatedStats, setAnimatedStats] = useState({
    totalValue: 0,
    gasSaved: 0,
    missions: 0,
    chains: 0,
  })

  useEffect(() => {
    if (stats) {
      // Parse numeric values for animation
      const totalValue = Number.parseFloat(stats.valueBridged?.replace(/[^0-9.]/g, "") || "0")
      const gasSaved = Number.parseFloat(stats.gasSaved?.replace(/[^0-9.]/g, "") || "0")

      // Animate the counters
      const duration = 1500
      const frameRate = 30
      const frames = duration / (1000 / frameRate)
      let frame = 0

      const interval = setInterval(() => {
        frame++
        const progress = frame / frames
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Cubic ease out

        setAnimatedStats({
          totalValue: Math.min(totalValue * easeProgress, totalValue),
          gasSaved: Math.min(gasSaved * easeProgress, gasSaved),
          missions: Math.min(Math.round(stats.totalMissions * easeProgress), stats.totalMissions),
          chains: Math.min(Math.round(stats.chainsUsed * easeProgress), stats.chainsUsed),
        })

        if (frame >= frames) clearInterval(interval)
      }, 1000 / frameRate)

      return () => clearInterval(interval)
    }
  }, [stats])

  const statItems = [
    {
      label: "Total Value Bridged",
      value: isLoading ? null : `$${animatedStats.totalValue.toFixed(2)}`,
      color: "text-electric-blue",
      icon: "💎",
    },
    {
      label: "Gas Saved",
      value: isLoading ? null : `${animatedStats.gasSaved.toFixed(3)} ETH`,
      color: "text-neon-green",
      icon: "⚡",
    },
    {
      label: "Missions Completed",
      value: isLoading ? null : animatedStats.missions,
      color: "text-cosmic-purple",
      icon: "🚀",
    },
    {
      label: "Chains Used",
      value: isLoading ? null : animatedStats.chains,
      color: "text-yellow-400",
      icon: "🔗",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={index}
          className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="text-3xl mb-2">{item.icon}</div>
          <div className="text-sm text-gray-400 mb-1">{item.label}</div>
          {isLoading ? (
            <Skeleton className="h-8 w-24 mx-auto bg-slate-grey/40" />
          ) : (
            <div className={`text-2xl font-bold ${item.color} font-tech`}>{item.value}</div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
