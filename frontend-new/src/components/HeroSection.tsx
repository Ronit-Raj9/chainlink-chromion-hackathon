"use client"

import { motion } from "framer-motion"
import { ChevronRight, Rocket } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="container mx-auto px-6 pt-20 pb-32 text-center">
      {/* Floating Rocket Icon */}
      <motion.div
        className="flex justify-center mb-8"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="relative">
          <motion.div
            className="w-24 h-24 bg-gradient-to-br from-electric-blue via-cosmic-purple to-neon-cyan rounded-3xl flex items-center justify-center"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Rocket className="w-12 h-12 text-white" />
          </motion.div>
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-electric-blue via-cosmic-purple to-neon-cyan rounded-3xl blur-xl opacity-60"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.6, 0.8, 0.6] 
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      </motion.div>

      {/* Main Heading */}
      <motion.h1
        className="text-5xl md:text-7xl font-bold font-orbitron mb-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="bg-hero-gradient bg-clip-text text-transparent">
          Bridge Across
        </span>
        <br />
        <span className="text-white">The Cosmos</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-tech"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        The first cross-chain bridge powered by <span className="text-electric-blue font-semibold">Chainlink CCIP</span>. 
        Send tokens between blockchains with maximum security and minimal gas fees.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {/* Primary Button */}
        <Link href="/launchpad">
          <motion.button
            className="group px-8 py-4 bg-gradient-to-r from-electric-blue to-neon-cyan text-white font-bold rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 font-tech text-lg flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Rocket className="w-5 h-5" />
            <span>Launch Mission</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>

        {/* Secondary Button */}
        <motion.button
          className="px-8 py-4 border-2 border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-white transition-all duration-300 rounded-xl font-tech text-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Routes
        </motion.button>
      </motion.div>
    </section>
  )
} 