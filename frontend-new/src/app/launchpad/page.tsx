"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import LaunchpadInterface from "@/components/launchpad/LaunchpadInterface"
import StarField from "@/components/StarField"

export default function LaunchpadPage() {
  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      {/* Animated Star Field Background */}
      <StarField />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-space-gradient opacity-90 z-10" />
      
      {/* Main Content */}
      <div className="relative z-20">
        <Header />
        
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue via-cosmic-purple to-neon-cyan rounded-2xl flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-orbitron">
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                STARBRIDGE MISSION
              </span>
              <br />
              <span className="text-white">CONTROL</span>
            </h1>
          </div>
          <p className="text-lg text-gray-300 font-tech">
            Configure your interstellar journey • Launch your tokens across the cosmos
          </p>
        </motion.div>

        {/* Launchpad Interface */}
        <LaunchpadInterface />
      </div>
    </div>
  )
} 