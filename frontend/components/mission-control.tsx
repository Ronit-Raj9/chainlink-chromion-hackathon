"use client"

import { useState } from "react"
import { PlanetSelector } from "./planet-selector"
import { RocketVisual } from "./rocket-visual"
import { BridgeForm } from "./bridge-form"
import { StatusPanel } from "./status-panel"
import { LaunchButton } from "./launch-button"
import { SoundToggle } from "./sound-toggle"

export type BridgeState = "idle" | "configuring" | "ready" | "launching" | "traveling" | "landing" | "completed"

export interface BridgeConfig {
  sourceChain: string
  targetChain: string
  amount: string
  token: string
}

export function MissionControl() {
  const [bridgeState, setBridgeState] = useState<BridgeState>("idle")
  const [config, setConfig] = useState<BridgeConfig>({
    sourceChain: "",
    targetChain: "",
    amount: "",
    token: "ETH",
  })

  const handleConfigChange = (newConfig: Partial<BridgeConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }))
    if (bridgeState === "idle" && (newConfig.sourceChain || newConfig.targetChain || newConfig.amount)) {
      setBridgeState("configuring")
    }
  }

  const handleLaunch = () => {
    setBridgeState("launching")

    // Simulate bridge process
    setTimeout(() => setBridgeState("traveling"), 2000)
    setTimeout(() => setBridgeState("landing"), 5000)
    setTimeout(() => setBridgeState("completed"), 7000)
    setTimeout(() => {
      setBridgeState("idle")
      setConfig({ sourceChain: "", targetChain: "", amount: "", token: "ETH" })
    }, 10000)
  }

  const isConfigComplete =
    config.sourceChain && config.targetChain && config.amount && config.sourceChain !== config.targetChain

  return (
    <div className="pt-20 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 neon-text font-orbitron">🌌 STARBRIDGE MISSION CONTROL</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto font-tech">
            Configure your interstellar journey • Launch your tokens across the cosmos
          </p>
          <SoundToggle />
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[600px]">
          {/* Source Planet (Left) */}
          <div className="lg:col-span-3">
            <PlanetSelector
              type="source"
              selectedChain={config.sourceChain}
              onChainSelect={(chain) => handleConfigChange({ sourceChain: chain })}
              bridgeState={bridgeState}
            />
          </div>

          {/* Rocket Animation (Center) */}
          <div className="lg:col-span-6 flex flex-col items-center space-y-8">
            <RocketVisual bridgeState={bridgeState} sourceChain={config.sourceChain} targetChain={config.targetChain} />

            <BridgeForm config={config} onConfigChange={handleConfigChange} bridgeState={bridgeState} />

            <LaunchButton
              isReady={isConfigComplete && bridgeState === "configuring"}
              bridgeState={bridgeState}
              onLaunch={handleLaunch}
            />
          </div>

          {/* Target Planet (Right) */}
          <div className="lg:col-span-3">
            <PlanetSelector
              type="target"
              selectedChain={config.targetChain}
              onChainSelect={(chain) => handleConfigChange({ targetChain: chain })}
              bridgeState={bridgeState}
              excludeChain={config.sourceChain}
            />
          </div>
        </div>

        {/* Status Panel */}
        <StatusPanel bridgeState={bridgeState} config={config} />
      </div>
    </div>
  )
}
