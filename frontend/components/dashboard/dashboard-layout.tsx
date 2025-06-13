"use client"

import { useState } from "react"
import { DashboardSidebar } from "./dashboard-sidebar"
import { MissionHistory } from "./mission-history"
import { UserStats } from "./user-stats"
import { Achievements } from "./achievements"
import { SavedRoutes } from "./saved-routes"
import { AgentLogs } from "./agent-logs"
import { DashboardTabs } from "./dashboard-tabs"
import { useMockDashboardData } from "@/hooks/use-mock-dashboard-data"
import { motion } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"

type DashboardTab = "missions" | "achievements" | "saved" | "agent"

interface DashboardLayoutProps {
  userId: string
}

export function DashboardLayout({ userId }: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("missions")
  const { data, isLoading, error } = useMockDashboardData(userId)
  const isMobile = useMediaQuery("(max-width: 1023px)")

  // Filter state
  const [filters, setFilters] = useState({
    chain: "all",
    status: "all",
    timeRange: "all",
  })

  // Apply filters to missions
  const filteredMissions = data?.missions.filter((mission) => {
    if (filters.chain !== "all" && mission.fromChain !== filters.chain && mission.toChain !== filters.chain) {
      return false
    }
    if (filters.status !== "all" && mission.status !== filters.status) {
      return false
    }
    // Time range filtering would go here
    return true
  })

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar - Hidden on mobile */}
      {!isMobile && (
        <motion.div
          className="lg:w-1/4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardSidebar
            stats={data?.stats}
            isLoading={isLoading}
            filters={filters}
            onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
          />
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {/* Mobile Tabs */}
        {isMobile && (
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} isLoading={isLoading} stats={data?.stats} />
        )}

        {/* Tab Content */}
        <div className="space-y-8">
          {/* User Stats - Always visible on desktop, visible on mobile only when stats tab is active */}
          {(!isMobile || activeTab === "missions") && <UserStats stats={data?.stats} isLoading={isLoading} />}

          {/* Mission History */}
          {(!isMobile || activeTab === "missions") && (
            <MissionHistory missions={filteredMissions} isLoading={isLoading} error={error} />
          )}

          {/* Achievements */}
          {(!isMobile || activeTab === "achievements") && (
            <Achievements achievements={data?.achievements} isLoading={isLoading} />
          )}

          {/* Saved Routes */}
          {(!isMobile || activeTab === "saved") && (
            <SavedRoutes savedRoutes={data?.savedRoutes} isLoading={isLoading} />
          )}

          {/* Agent Logs */}
          {(!isMobile || activeTab === "agent") && <AgentLogs agentLogs={data?.agentLogs} isLoading={isLoading} />}
        </div>
      </motion.div>
    </div>
  )
}
