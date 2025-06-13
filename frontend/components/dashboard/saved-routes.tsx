"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowRight, Star, Plus } from "lucide-react"
import type { SavedRoute } from "@/types/dashboard"
import { useRouter } from "next/navigation"

interface SavedRoutesProps {
  savedRoutes?: SavedRoute[]
  isLoading: boolean
}

export function SavedRoutes({ savedRoutes, isLoading }: SavedRoutesProps) {
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

  return (
    <div className="bg-slate-grey/20 rounded-lg border border-neon-green/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold neon-text font-orbitron">Saved Routes</h3>
        <Button
          size="sm"
          variant="outline"
          className="border-neon-green text-neon-green hover:bg-neon-green/10"
          onClick={() => router.push("/routes")}
        >
          <Plus className="h-4 w-4 mr-1" />
          New Route
        </Button>
      </div>

      {isLoading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-4 bg-black/40 rounded-lg border border-gray-800">
              <div className="flex justify-between mb-3">
                <Skeleton className="h-8 w-24 bg-slate-grey/40" />
                <Skeleton className="h-6 w-6 rounded-full bg-slate-grey/40" />
              </div>
              <Skeleton className="h-4 w-full mb-2 bg-slate-grey/40" />
              <Skeleton className="h-8 w-full rounded-md bg-slate-grey/40" />
            </div>
          ))}
        </div>
      ) : savedRoutes && savedRoutes.length > 0 ? (
        // Saved routes grid
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {savedRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              className="p-4 bg-black/40 rounded-lg border border-neon-green/20 hover:border-neon-green/40 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/routes?from=${route.fromChain}&to=${route.toChain}`)}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-white">{route.name}</h4>
                <Star className="h-5 w-5 text-yellow-400" fill="currentColor" />
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getChainIcon(route.fromChain)}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="text-xl">{getChainIcon(route.toChain)}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {route.fromChain} → {route.toChain}
                </div>
              </div>

              <Button className="w-full bg-neon-green/20 hover:bg-neon-green/30 text-neon-green border border-neon-green/30">
                Launch Mission
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-8">
          <div className="text-6xl mb-4">⭐</div>
          <h4 className="text-lg font-bold text-white mb-2">No Saved Routes</h4>
          <p className="text-gray-400 mb-4">Save your favorite routes for quick access</p>
          <Button
            className="bg-neon-green hover:bg-neon-green/80 text-black font-bold"
            onClick={() => router.push("/routes")}
          >
            Create First Route
          </Button>
        </div>
      )}
    </div>
  )
}
