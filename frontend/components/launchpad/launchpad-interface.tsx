"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChainSelector } from "./chain-selector"
import { RocketAnimation } from "./rocket-animation"
import { MissionConfigForm } from "./mission-config-form"
import { LaunchButton } from "./launch-button"
import { ParticipantsPanel } from "./participants-panel"
import { AIHintBox } from "./ai-hint-box"
import { LaunchStatusBox } from "./launch-status-box"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { useMockLaunchpadData } from "@/hooks/use-mock-launchpad-data"
import { useMediaQuery } from "@/hooks/use-media-query"

export type LaunchState = "idle" | "configuring" | "ready" | "launching" | "traveling" | "completed" | "failed"

interface LaunchpadInterfaceProps {
  userId?: string
}

export function LaunchpadInterface({ userId }: LaunchpadInterfaceProps) {
  const [launchState, setLaunchState] = useState<LaunchState>("idle")
  const [sourceChain, setSourceChain] = useState<string>("")
  const [targetChain, setTargetChain] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [token, setToken] = useState<string>("ETH")
  const [missionName, setMissionName] = useState<string>("")
  const [showAIHint, setShowAIHint] = useState(false)
  const [showLaunchStatus, setShowLaunchStatus] = useState(false)
  const [launchSuccess, setLaunchSuccess] = useState<boolean | null>(null)

  const { preferences, savePreferences } = useUserPreferences(userId)
  const { participants, gasPrice, etaMinutes } = useMockLaunchpadData(sourceChain, targetChain)
  const isMobile = useMediaQuery("(max-width: 1023px)")

  // Load user preferences when component mounts
  useEffect(() => {
    if (preferences) {
      setSourceChain(preferences.lastSourceChain || "")
      setTargetChain(preferences.lastTargetChain || "")
      setToken(preferences.lastToken || "ETH")

      // If user had a failed mission, suggest retry
      if (preferences.lastMissionFailed) {
        setAmount(preferences.lastAmount || "")
        setMissionName(preferences.lastMissionName || "")
        setShowAIHint(true)
      }
    }
  }, [preferences])

  // Update launch state based on form completion
  useEffect(() => {
    if (sourceChain && targetChain && amount && sourceChain !== targetChain) {
      setLaunchState(launchState === "idle" ? "configuring" : launchState)
    } else {
      setLaunchState("idle")
    }
  }, [sourceChain, targetChain, amount, launchState])

  const handleSourceChainChange = (chain: string) => {
    setSourceChain(chain)
    if (chain === targetChain) {
      setTargetChain("")
    }
  }

  const handleTargetChainChange = (chain: string) => {
    setTargetChain(chain)
    if (chain === sourceChain) {
      setSourceChain("")
    }
  }

  const handleLaunch = () => {
    // Save user preferences
    savePreferences({
      lastSourceChain: sourceChain,
      lastTargetChain: targetChain,
      lastToken: token,
      lastAmount: amount,
      lastMissionName: missionName,
      lastMissionFailed: false,
    })

    // Start launch sequence
    setLaunchState("launching")
    setShowLaunchStatus(true)

    // Simulate bridge process
    setTimeout(() => setLaunchState("traveling"), 3000)

    // Randomly succeed or fail (90% success rate)
    const willSucceed = Math.random() > 0.1

    setTimeout(() => {
      setLaunchState(willSucceed ? "completed" : "failed")
      setLaunchSuccess(willSucceed)

      // If failed, update preferences
      if (!willSucceed) {
        savePreferences({
          ...preferences,
          lastMissionFailed: true,
        })
      }
    }, 8000)
  }

  const resetLaunch = () => {
    setLaunchState("idle")
    setShowLaunchStatus(false)
    setLaunchSuccess(null)
  }

  const isConfigComplete = sourceChain && targetChain && amount && sourceChain !== targetChain

  return (
    <div className="relative">
      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Source Chain (Left) */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChainSelector
            type="source"
            selectedChain={sourceChain}
            onChainSelect={handleSourceChainChange}
            launchState={launchState}
          />
        </motion.div>

        {/* Center Column - Rocket Animation */}
        <motion.div
          className="lg:col-span-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col items-center space-y-6">
            <RocketAnimation launchState={launchState} sourceChain={sourceChain} targetChain={targetChain} />

            {/* AI Hint */}
            {showAIHint && launchState !== "launching" && launchState !== "traveling" && (
              <AIHintBox
                sourceChain={sourceChain}
                targetChain={targetChain}
                onClose={() => setShowAIHint(false)}
                suggestRetry={preferences?.lastMissionFailed || false}
              />
            )}

            {/* Mission Configuration Form */}
            <MissionConfigForm
              amount={amount}
              setAmount={setAmount}
              token={token}
              setToken={setToken}
              missionName={missionName}
              setMissionName={setMissionName}
              sourceChain={sourceChain}
              targetChain={targetChain}
              gasPrice={gasPrice}
              etaMinutes={etaMinutes}
              participants={participants}
              disabled={launchState === "launching" || launchState === "traveling"}
            />

            {/* Launch Button */}
            <LaunchButton
              isReady={isConfigComplete && launchState === "configuring"}
              launchState={launchState}
              onLaunch={handleLaunch}
            />
          </div>
        </motion.div>

        {/* Target Chain (Right) */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChainSelector
            type="target"
            selectedChain={targetChain}
            onChainSelect={handleTargetChainChange}
            launchState={launchState}
            excludeChain={sourceChain}
          />
        </motion.div>
      </div>

      {/* Participants Panel */}
      {!isMobile && participants.length > 0 && (
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ParticipantsPanel participants={participants} />
        </motion.div>
      )}

      {/* Launch Status Overlay */}
      {showLaunchStatus && (
        <LaunchStatusBox
          launchState={launchState}
          success={launchSuccess}
          sourceChain={sourceChain}
          targetChain={targetChain}
          amount={amount}
          token={token}
          onClose={resetLaunch}
        />
      )}
    </div>
  )
}
