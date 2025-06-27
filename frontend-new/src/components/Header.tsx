"use client"

import { motion } from "framer-motion"
import { Rocket } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ConnectWallet from "./ConnectWallet"

export default function Header() {
  const pathname = usePathname()
  
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="w-full py-6 px-4"
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-electric-blue to-cosmic-purple rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-blue to-cosmic-purple rounded-lg blur-lg opacity-50 -z-10"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold font-orbitron text-white">StarBridge</h1>
            </div>
          </Link>
        </motion.div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            href="/launchpad" 
            className={`transition-colors font-tech ${
              pathname === "/launchpad" ? "text-electric-blue" : "text-gray-300 hover:text-white"
            }`}
          >
            Launchpad
          </Link>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech">Routes</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech">Dashboard</a>
          <a href="#" className="text-gray-300 hover:text-white transition-colors font-tech">AI Assistant</a>
        </nav>

        {/* Connect Wallet Button */}
        <ConnectWallet />
      </div>
    </motion.header>
  )
} 