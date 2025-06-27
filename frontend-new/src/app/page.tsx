"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import HeroSection from "@/components/HeroSection"
import StatsSection from "@/components/StatsSection"
import FeaturesSection from "@/components/FeaturesSection"
import RoutesSection from "@/components/RoutesSection"
import StarField from "@/components/StarField"

export default function Home() {
  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      {/* Animated Star Field Background */}
      <StarField />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-space-gradient opacity-90 z-10" />
      
      {/* Main Content */}
      <div className="relative z-20">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <HeroSection />
          
          {/* Statistics */}
          <StatsSection />
          
          {/* Features */}
          <FeaturesSection />
          
          {/* Routes */}
          <RoutesSection />
        </main>
      </div>
    </div>
  )
}
