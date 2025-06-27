"use client"

import { motion } from "framer-motion"
import { Shield, Zap, Globe, Gift } from "lucide-react"

const features = [
  {
    id: 1,
    icon: Shield,
    title: "🔗 Chainlink CCIP Security",
    description: "Military-grade cross-chain security powered by Chainlink's battle-tested infrastructure",
    color: "from-electric-blue to-neon-cyan"
  },
  {
    id: 2,
    icon: Zap,
    title: "⚡ Pool Transfer",
    description: "Join other space travelers to share gas costs and maximize efficiency",
    color: "from-cosmic-purple to-electric-blue"
  },
  {
    id: 3,
    icon: Globe,
    title: "🌐 Multi-chain Support",
    description: "Bridge between Ethereum, Arbitrum, Polygon, and more blockchain worlds",
    color: "from-neon-cyan to-cosmic-purple"
  },
  {
    id: 4,
    icon: Gift,
    title: "🎁 Executor Rewards",
    description: "Earn rewards by initiating rocket launches when starships are ready",
    color: "from-electric-blue to-cosmic-purple"
  }
]

export default function FeaturesSection() {
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
            Mission Features
          </h2>
          <p className="text-xl text-gray-300 font-tech max-w-3xl mx-auto">
            Advanced technology for seamless interstellar token transfers
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Card */}
              <div className="glass-effect rounded-2xl p-6 h-full relative overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 5 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-bold font-orbitron mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-electric-blue group-hover:to-cosmic-purple transition-all duration-300">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 font-tech leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Animated border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300`}></div>
              </div>

              {/* Glow effect */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 