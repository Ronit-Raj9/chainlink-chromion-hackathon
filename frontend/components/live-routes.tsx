"use client"

import { useState } from "react"
import { ArrowRight, Rocket, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const routes = [
  {
    id: 1,
    source: "Ethereum",
    destination: "Arbitrum",
    sourceIcon: "/placeholder.svg?height=24&width=24",
    destinationIcon: "/placeholder.svg?height=24&width=24",
    tvl: "$420,690",
    participants: 12,
    timeRemaining: "3:42",
    status: "launching-soon",
  },
  {
    id: 2,
    source: "Polygon",
    destination: "Optimism",
    sourceIcon: "/placeholder.svg?height=24&width=24",
    destinationIcon: "/placeholder.svg?height=24&width=24",
    tvl: "$69,420",
    participants: 8,
    timeRemaining: "1:20",
    status: "ready",
  },
  {
    id: 3,
    source: "Arbitrum",
    destination: "Base",
    sourceIcon: "/placeholder.svg?height=24&width=24",
    destinationIcon: "/placeholder.svg?height=24&width=24",
    tvl: "$123,456",
    participants: 15,
    timeRemaining: "0:45",
    status: "launching-soon",
  },
]

export function LiveRoutes() {
  const [activeTab, setActiveTab] = useState("popular")

  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">Live Starship Routes</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join a mission already in progress or create your own interstellar journey
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md p-1 bg-slate-grey/30">
            <button
              onClick={() => setActiveTab("popular")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "popular" ? "bg-electric-blue text-black" : "text-gray-300 hover:text-white"
              }`}
            >
              Popular Routes
            </button>
            <button
              onClick={() => setActiveTab("new")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "new" ? "bg-electric-blue text-black" : "text-gray-300 hover:text-white"
              }`}
            >
              New Missions
            </button>
            <button
              onClick={() => setActiveTab("your")}
              className={`px-4 py-2 rounded-md ${
                activeTab === "your" ? "bg-electric-blue text-black" : "text-gray-300 hover:text-white"
              }`}
            >
              Your Routes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-6 rounded-lg bg-slate-grey/20 border border-electric-blue/20 hover:border-electric-blue/40 transition-all duration-300 hover:neon-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={route.sourceIcon || "/placeholder.svg"}
                    alt={route.source}
                    className="h-8 w-8 rounded-full bg-gray-700 p-1"
                  />
                  <span className="mx-2 text-lg font-medium">{route.source}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <img
                    src={route.destinationIcon || "/placeholder.svg"}
                    alt={route.destination}
                    className="h-8 w-8 rounded-full bg-gray-700 p-1 ml-2"
                  />
                  <span className="ml-2 text-lg font-medium">{route.destination}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-sm text-gray-400">Total Value</div>
                  <div className="text-xl font-bold text-electric-blue">{route.tvl}</div>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-cosmic-purple mr-1" />
                  <span className="text-cosmic-purple">{route.participants}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-neon-green mr-1" />
                  <span className="text-neon-green">{route.timeRemaining}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div
                  className={`flex items-center ${route.status === "ready" ? "text-neon-green" : "text-cosmic-purple"}`}
                >
                  <Rocket className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">
                    {route.status === "ready" ? "Ready for Launch" : "Launching Soon"}
                  </span>
                </div>
                <Link href="/routes">
                  <Button
                    size="sm"
                    className={`${
                      route.status === "ready"
                        ? "bg-neon-green hover:bg-neon-green/80 text-black"
                        : "bg-cosmic-purple hover:bg-cosmic-purple/80"
                    }`}
                  >
                    {route.status === "ready" ? "Launch Now" : "Join Mission"}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/routes">
            <Button className="bg-electric-blue hover:bg-electric-blue/80 text-black font-bold px-8 py-4 text-lg neon-glow">
              View All Routes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
