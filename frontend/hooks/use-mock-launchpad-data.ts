"use client"

import { useState, useEffect } from "react"
import type { Participant } from "@/types/launchpad"

export function useMockLaunchpadData(sourceChain: string, targetChain: string) {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [gasPrice, setGasPrice] = useState(0.01) // ETH
  const [etaMinutes, setEtaMinutes] = useState(15)

  // Generate mock participants based on selected chains
  useEffect(() => {
    if (sourceChain && targetChain) {
      // Generate random number of participants (3-8)
      const numParticipants = Math.floor(Math.random() * 6) + 3

      const mockParticipants: Participant[] = []

      for (let i = 0; i < numParticipants; i++) {
        mockParticipants.push({
          id: `user-${i}`,
          name: `Pilot ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
          status: Math.random() > 0.3 ? "ready" : "preparing",
          avatar: "",
        })
      }

      setParticipants(mockParticipants)

      // Set gas price based on chains
      let baseGas = 0.01
      if (targetChain === "ethereum") {
        baseGas = 0.015
      } else if (sourceChain === "optimism" && targetChain === "base") {
        baseGas = 0.008
      }

      // Add some randomness
      const randomFactor = 0.9 + Math.random() * 0.2
      setGasPrice(baseGas * randomFactor)

      // Set ETA based on chains
      let baseEta = 15
      if (targetChain === "ethereum") {
        baseEta = 20
      } else if (sourceChain === "arbitrum" && targetChain === "optimism") {
        baseEta = 12
      }

      setEtaMinutes(baseEta)
    } else {
      setParticipants([])
    }
  }, [sourceChain, targetChain])

  return { participants, gasPrice, etaMinutes }
}
