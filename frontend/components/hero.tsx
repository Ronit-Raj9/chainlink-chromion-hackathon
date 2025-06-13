"use client"

import Link from "next/link"
import { Rocket, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-float mb-8">
          <Rocket className="h-32 w-32 mx-auto text-electric-blue animate-pulse-neon" />
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 neon-text">
          Star<span className="text-cosmic-purple">Bridge</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
          Experience the future of cross-chain transfers. Watch your tokens launch through space as rockets bridge
          between blockchain worlds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/routes">
            <Button className="bg-electric-blue hover:bg-electric-blue/80 text-black font-bold px-8 py-4 text-lg neon-glow group">
              🚀 Board a Starship
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Button
            variant="outline"
            className="border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple hover:text-white px-8 py-4 text-lg"
          >
            View Mission Control
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg bg-slate-grey/20 border border-electric-blue/20">
            <div className="text-3xl font-bold text-electric-blue mb-2">$2.4M+</div>
            <div className="text-gray-400">Total Value Bridged</div>
          </div>
          <div className="p-6 rounded-lg bg-slate-grey/20 border border-cosmic-purple/20">
            <div className="text-3xl font-bold text-cosmic-purple mb-2">15,420</div>
            <div className="text-gray-400">Successful Missions</div>
          </div>
          <div className="p-6 rounded-lg bg-slate-grey/20 border border-neon-green/20">
            <div className="text-3xl font-bold text-neon-green mb-2">89%</div>
            <div className="text-gray-400">Gas Savings</div>
          </div>
        </div>
      </div>
    </section>
  )
}
