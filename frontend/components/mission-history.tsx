"use client"

import { Badge } from "@/components/ui/badge"
import { ExternalLink, CheckCircle } from "lucide-react"

const missions = [
  {
    id: "1",
    from: "Arbitrum",
    to: "Ethereum",
    fromIcon: "🔵",
    toIcon: "💎",
    amount: "0.5 ETH",
    date: "2024-01-15",
    status: "completed",
    txHash: "0x742d35cc6bf4a8b...",
    savings: "0.008 ETH",
  },
  {
    id: "2",
    from: "Polygon",
    to: "Ethereum",
    fromIcon: "🟣",
    toIcon: "💎",
    amount: "100 USDC",
    date: "2024-01-12",
    status: "completed",
    txHash: "0x8a3f21bc7de5c9a...",
    savings: "0.012 ETH",
  },
  {
    id: "3",
    from: "Optimism",
    to: "Arbitrum",
    fromIcon: "🔴",
    toIcon: "🔵",
    amount: "0.25 ETH",
    date: "2024-01-10",
    status: "completed",
    txHash: "0x1b4e67dc8f2a3e5...",
    savings: "0.005 ETH",
  },
]

export function MissionHistory() {
  return (
    <div className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-6">
      <h3 className="text-2xl font-bold mb-6 neon-text">Mission History</h3>

      <div className="space-y-4">
        {missions.map((mission) => (
          <div
            key={mission.id}
            className="p-4 bg-black/40 rounded-lg border border-cosmic-purple/20 hover:border-cosmic-purple/40 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{mission.fromIcon}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-xl">{mission.toIcon}</span>
                </div>
                <div>
                  <div className="font-bold text-white">
                    {mission.from} → {mission.to}
                  </div>
                  <div className="text-sm text-gray-400">{mission.date}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-white">{mission.amount}</div>
                <div className="text-sm text-neon-green">Saved {mission.savings}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed
              </Badge>

              <button className="flex items-center space-x-1 text-electric-blue hover:text-white transition-colors text-sm">
                <span className="font-tech">{mission.txHash}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
