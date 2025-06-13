"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import type { Achievement } from "@/types/dashboard"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AchievementsProps {
  achievements?: Achievement[]
  isLoading: boolean
}

export function Achievements({ achievements, isLoading }: AchievementsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "All" },
    { id: "bridge", name: "Bridge" },
    { id: "savings", name: "Savings" },
    { id: "explorer", name: "Explorer" },
  ]

  const filteredAchievements = achievements?.filter(
    (achievement) => selectedCategory === "all" || achievement.category === selectedCategory,
  )

  return (
    <div className="bg-slate-grey/20 rounded-lg border border-cosmic-purple/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold neon-text font-orbitron">Achievements</h3>

        <div className="flex space-x-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 text-sm rounded-full transition-all ${
                selectedCategory === category.id
                  ? "bg-cosmic-purple/30 text-cosmic-purple"
                  : "bg-slate-grey/40 text-gray-400 hover:bg-slate-grey/60"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 bg-black/40 rounded-lg border border-gray-800">
              <div className="flex justify-between mb-3">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-grey/40" />
                <Skeleton className="h-5 w-16 rounded-full bg-slate-grey/40" />
              </div>
              <Skeleton className="h-4 w-32 mb-2 bg-slate-grey/40" />
              <Skeleton className="h-3 w-full bg-slate-grey/40" />
            </div>
          ))}
        </div>
      ) : filteredAchievements && filteredAchievements.length > 0 ? (
        // Achievement grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              className={`p-4 rounded-lg border transition-all ${
                achievement.earned
                  ? "bg-cosmic-purple/10 border-cosmic-purple/30"
                  : "bg-black/20 border-gray-600 opacity-50"
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-2xl">{achievement.icon}</div>
                {achievement.earned ? (
                  <Badge className="bg-cosmic-purple/20 text-cosmic-purple border-cosmic-purple/30 text-xs">
                    Earned
                  </Badge>
                ) : (
                  <Badge className="bg-gray-800 text-gray-400 border-gray-700 text-xs">Locked</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white">{achievement.name}</h4>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-white">
                        <Info className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black/90 border-cosmic-purple/30 text-white">
                      <p>{achievement.description}</p>
                      {!achievement.earned && achievement.progress && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-400 mb-1">
                            Progress: {achievement.progress.current}/{achievement.progress.target}
                          </div>
                          <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cosmic-purple"
                              style={{
                                width: `${(achievement.progress.current / achievement.progress.target) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>

              {!achievement.earned && achievement.progress && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>
                      {achievement.progress.current}/{achievement.progress.target}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cosmic-purple"
                      initial={{ width: 0 }}
                      animate={{ width: `${(achievement.progress.current / achievement.progress.target) * 100}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                    ></motion.div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🏆</div>
          <h4 className="text-lg font-bold text-white mb-2">No Achievements Yet</h4>
          <p className="text-gray-400">Complete missions to earn achievements and badges</p>
        </div>
      )}
    </div>
  )
}
