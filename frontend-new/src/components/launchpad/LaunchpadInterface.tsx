"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAccount, useChainId } from 'wagmi'
import { arbitrumSepolia } from 'wagmi/chains'
import { toast } from 'sonner'
import ChainSelector from "./ChainSelector"
import CargoManifest from "./CargoManifest"
import LaunchButton from "./LaunchButton"
import MissionTimeline from "./MissionTimeline"
import RocketAnimation from "./RocketAnimation"
import { useShipFactory } from '@/hooks/useShipFactory'
import { useTokenInfo } from '@/hooks/useToken'

export type LaunchState = "idle" | "configuring" | "approving" | "creating" | "launching" | "traveling" | "completed" | "failed"

export default function LaunchpadInterface() {
  const [sourceChain, setSourceChain] = useState("arbitrum-sepolia")
  const [targetChain, setTargetChain] = useState("ethereum-sepolia") 
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState("USDC")
  const [launchState, setLaunchState] = useState<LaunchState>("idle")
  const [createdShipAddress, setCreatedShipAddress] = useState<string>("")

  // Wagmi hooks
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  // Contract hooks
  const { createShip, isPending: isCreating, isSuccess: shipCreated, hash } = useShipFactory()
  const { tokenAddress, decimals } = useTokenInfo(token)

  const requiredChainId = arbitrumSepolia.id
  const isWrongNetwork = isConnected && chainId !== requiredChainId

  // Check if form is complete
  const isFormComplete = () => {
    return (
      isConnected &&
      !isWrongNetwork &&
      sourceChain && 
      targetChain && 
      amount && 
      parseFloat(amount) > 0 && 
      sourceChain !== targetChain &&
      token &&
      tokenAddress &&
      decimals
    )
  }

  // Update launch state when form changes
  const updateLaunchState = () => {
    if (isFormComplete() && launchState === "idle") {
      setLaunchState("configuring")
    } else if (!isFormComplete() && launchState === "configuring") {
      setLaunchState("idle")
    }
  }

  // Effect to update launch state when dependencies change
  useEffect(() => {
    updateLaunchState()
  }, [isConnected, isWrongNetwork, sourceChain, targetChain, amount, token, tokenAddress, decimals, launchState])

  // Effect to handle ship creation success
  useEffect(() => {
    if (shipCreated && hash) {
      toast.success("🚀 Ship created successfully! Monitoring for boarding...")
      setLaunchState("traveling")
      
      // In a real app, you'd watch for events to get the ship address
      // For now, simulate the process
      setTimeout(() => {
        setLaunchState("completed")
        toast.success("🎉 Mission completed! Tokens bridged successfully!")
      }, 10000)
    }
  }, [shipCreated, hash])

  // Handle launch
  const handleLaunch = async () => {
    if (!isFormComplete()) {
      if (!isConnected) {
        toast.error("Please connect your wallet first")
        return
      }
      if (isWrongNetwork) {
        toast.error("Please switch to Arbitrum Sepolia network")
        return
      }
      toast.error("Please complete all form fields")
      return
    }

    try {
      setLaunchState("creating")
      toast.info("Creating new starship...")
      
      // Create ship with tokens
      const result = await createShip(
        [token], // Token symbols
        [amount], // Amounts
        [decimals!], // Token decimals
        10 // Capacity (default to 10 passengers)
      )

      if (!result.success) {
        throw result.error
      }

    } catch (error: any) {
      console.error("Launch failed:", error)
      setLaunchState("failed")
      toast.error(`Launch failed: ${error.message || "Unknown error"}`)
    }
  }

  // Reset mission
  const resetMission = () => {
    setLaunchState("idle")
    setAmount("")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
        
        {/* Source Chain */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex justify-center"
        >
          <ChainSelector
            type="source"
            selectedChain={sourceChain}
            onChainSelect={(chain) => {
              setSourceChain(chain)
              updateLaunchState()
            }}
            launchState={launchState}
          />
        </motion.div>

        {/* Center - Rocket and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="space-y-8"
        >
          {/* Rocket Animation */}
          <div className="flex justify-center">
            <RocketAnimation launchState={launchState} />
          </div>

          {/* Cargo Manifest */}
          <CargoManifest
            amount={amount}
            setAmount={(value) => {
              setAmount(value)
            }}
            token={token}
            setToken={(value) => {
              setToken(value)
            }}
            disabled={launchState === "creating" || launchState === "launching" || launchState === "traveling"}
          />

          {/* Launch Button */}
          <div className="flex justify-center">
            <LaunchButton
              isReady={isFormComplete()}
              launchState={launchState}
              onLaunch={handleLaunch}
              isPending={isCreating}
            />
          </div>

          {/* Reset Button */}
          {(launchState === "completed" || launchState === "failed") && (
            <div className="flex justify-center">
              <button
                onClick={resetMission}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-tech text-sm transition-all"
              >
                🔄 Reset Mission
              </button>
            </div>
          )}
        </motion.div>

        {/* Target Chain */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex justify-center"
        >
          <ChainSelector
            type="target"
            selectedChain={targetChain}
            onChainSelect={(chain) => {
              setTargetChain(chain)
              updateLaunchState()
            }}
            launchState={launchState}
          />
        </motion.div>
      </div>

      {/* Mission Timeline */}
      {(launchState === "launching" || launchState === "traveling" || launchState === "completed") && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <MissionTimeline 
            launchState={launchState}
            amount={amount}
            token={token}
          />
        </motion.div>
      )}
    </div>
  )
} 