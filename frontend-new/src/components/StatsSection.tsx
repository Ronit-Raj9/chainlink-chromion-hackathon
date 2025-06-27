"use client"

import { motion } from "framer-motion"

const stats = [
  {
    id: 1,
    value: "$2.4M+",
    label: "Total Value Bridged",
    color: "from-electric-blue to-neon-cyan"
  },
  {
    id: 2,
    value: "15,420",
    label: "Successful Missions",
    color: "from-cosmic-purple to-electric-blue"
  },
  {
    id: 3,
    value: "89%",
    label: "Gas Savings",
    color: "from-neon-cyan to-cosmic-purple"
  }
]

export default function StatsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Card */}
              <div className="glass-effect rounded-2xl p-8 text-center relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <motion.div
                    className={`text-4xl md:text-5xl font-bold font-orbitron mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-300 font-tech text-lg">
                    {stat.label}
                  </div>
                </div>

                {/* Animated border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300`}></div>
              </div>

              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 