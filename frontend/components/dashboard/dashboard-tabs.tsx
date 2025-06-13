"use client"

import { motion } from "framer-motion"
import { Rocket, Award, Star, MessageSquare } from "lucide-react"
import type { UserStats } from "@/types/dashboard"

type DashboardTab = "missions" | "achievements" | "saved" | "agent"

interface DashboardTabsProps {
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  isLoading: boolean
  stats?: UserStats
}

export function DashboardTabs({ activeTab, onTabChange, isLoading, stats }: DashboardTabsProps) {
  const tabs = [
    {
      id: "missions" as DashboardTab,
      label: "Missions",
      icon: <Rocket className="h-4 w-4" />,
      count: stats?.totalMissions || 0,
    },
    {
      id: "achievements" as DashboardTab,
      label: "Achievements",
      icon: <Award className="h-4 w-4" />,
      count: stats?.achievementsCount || 0,
    },
    {
      id: "saved" as DashboardTab,
      label: "Saved Routes",
      icon: <Star className="h-4 w-4" />,
      count: stats?.savedRoutesCount || 0,
    },
    {
      id: "agent" as DashboardTab,
      label: "AI Agent",
      icon: <MessageSquare className="h-4 w-4" />,
      count: stats?.agentLogsCount || 0,
    },
  ]

  return (
    <div className="mb-6">
      <div className="flex overflow-x-auto space-x-2 pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-electric-blue/20 border border-electric-blue/50 text-white"
                : "bg-slate-grey/20 border border-gray-700 text-gray-400 hover:bg-slate-grey/30"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={activeTab === tab.id ? "text-electric-blue" : "text-gray-400"}>{tab.icon}</span>
            <span>{tab.label}</span>
            {!isLoading && tab.count > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? "bg-electric-blue/30 text-electric-blue" : "bg-gray-800 text-gray-400"
                }`}
              >
                {tab.count}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
