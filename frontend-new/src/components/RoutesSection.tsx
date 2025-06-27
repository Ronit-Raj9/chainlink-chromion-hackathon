"use client"

import { motion } from "framer-motion"
import { ArrowRight, Users, Clock, TrendingUp } from "lucide-react"

const routes = [
  {
    id: 1,
    from: "Ethereum",
    to: "Arbitrum",
    totalValue: "$420,690",
    participants: 12,
    timeLeft: "3:42",
    status: "Launching Soon",
    statusColor: "text-orange-400",
    buttonText: "Join Mission",
    buttonColor: "bg-cosmic-purple hover:bg-cosmic-purple/80"
  },
  {
    id: 2,
    from: "Polygon",
    to: "Optimism",
    totalValue: "$69,420",
    participants: 8,
    timeLeft: "1:20",
    status: "Ready for Launch",
    statusColor: "text-green-400",
    buttonText: "Launch Now",
    buttonColor: "bg-green-500 hover:bg-green-600"
  },
  {
    id: 3,
    from: "Arbitrum",
    to: "Base",
    totalValue: "$123,456",
    participants: 15,
    timeLeft: "0:45",
    status: "Launching Soon",
    statusColor: "text-orange-400",
    buttonText: "Join Mission",
    buttonColor: "bg-cosmic-purple hover:bg-cosmic-purple/80"
  }
]

const tabs = [
  { id: "popular", label: "Popular Routes", active: true },
  { id: "new", label: "New Missions", active: false },
  { id: "your", label: "Your Routes", active: false }
]

export default function RoutesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron mb-6 text-white">
            Live Starship Routes
          </h2>
          <p className="text-xl text-gray-300 font-tech max-w-3xl mx-auto">
            Join a mission already in progress or create your own interstellar journey
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="flex bg-black/40 rounded-xl p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`px-6 py-3 rounded-lg font-tech font-medium transition-all duration-300 ${
                  tab.active
                    ? "bg-electric-blue text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {routes.map((route, index) => (
            <motion.div
              key={route.id}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Card */}
              <div className="glass-effect rounded-2xl p-6 relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/5 to-cosmic-purple/5 group-hover:from-electric-blue/10 group-hover:to-cosmic-purple/10 transition-all duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Route */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                      <span className="font-tech font-medium text-white">{route.from}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                    <div className="flex items-center space-x-3">
                      <span className="font-tech font-medium text-white">{route.to}</span>
                      <div className="w-3 h-3 bg-cosmic-purple rounded-full"></div>
                    </div>
                  </div>

                  {/* Total Value */}
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-400 font-tech mb-1">Total Value</div>
                    <div className="text-2xl font-bold font-orbitron text-white">{route.totalValue}</div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Users className="w-4 h-4 text-cosmic-purple" />
                        <span className="text-sm text-gray-400 font-tech">{route.participants}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 mb-1">
                        <Clock className="w-4 h-4 text-electric-blue" />
                        <span className="text-sm text-gray-400 font-tech">{route.timeLeft}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-center mb-6">
                    <span className={`text-sm font-tech ${route.statusColor}`}>
                      🚀 {route.status}
                    </span>
                  </div>

                  {/* Action Button */}
                  <motion.button
                    className={`w-full ${route.buttonColor} text-white py-3 rounded-lg font-tech font-medium transition-all duration-300`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {route.buttonText}
                  </motion.button>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric-blue/10 to-cosmic-purple/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Routes Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="bg-gradient-to-r from-electric-blue to-cosmic-purple hover:from-electric-blue/80 hover:to-cosmic-purple/80 text-white px-8 py-4 rounded-lg font-tech font-semibold text-lg transition-all duration-300 shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center space-x-2">
              <span>View All Routes</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
} 