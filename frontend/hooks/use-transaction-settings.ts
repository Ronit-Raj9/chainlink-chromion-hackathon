"use client"

import { useState, useEffect } from "react"

interface TransactionSettings {
  gasPreference: "low" | "medium" | "high" | "custom"
  transactionSpeed: "economic" | "standard" | "fast" | "instant"
  customGasPrice: string
  gasMultiplier: number
  autoAdjust: boolean
  gasLimits: {
    tokenTransfer: string
    swap: string
    bridge: string
    contract: string
  }
}

const defaultSettings: TransactionSettings = {
  gasPreference: "medium",
  transactionSpeed: "standard",
  customGasPrice: "50",
  gasMultiplier: 1.5,
  autoAdjust: true,
  gasLimits: {
    tokenTransfer: "65000",
    swap: "200000",
    bridge: "350000",
    contract: "150000",
  },
}

export function useTransactionSettings(userId?: string) {
  const [settings, setSettings] = useState<TransactionSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const key = userId ? `starbridge-tx-settings-${userId}` : "starbridge-tx-settings-guest"
        const storedSettings = localStorage.getItem(key)
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings))
        }
        setIsLoaded(true)
      } catch (error) {
        console.error("Error loading transaction settings:", error)
        setIsLoaded(true)
      }
    }
  }, [userId])

  // Save settings to localStorage
  const saveSettings = (newSettings: Partial<TransactionSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings }
      const key = userId ? `starbridge-tx-settings-${userId}` : "starbridge-tx-settings-guest"
      localStorage.setItem(key, JSON.stringify(updatedSettings))
      setSettings(updatedSettings)
      return true
    } catch (error) {
      console.error("Error saving transaction settings:", error)
      return false
    }
  }

  // Reset settings to defaults
  const resetSettings = () => {
    try {
      const key = userId ? `starbridge-tx-settings-${userId}` : "starbridge-tx-settings-guest"
      localStorage.setItem(key, JSON.stringify(defaultSettings))
      setSettings(defaultSettings)
      return true
    } catch (error) {
      console.error("Error resetting transaction settings:", error)
      return false
    }
  }

  // Calculate gas price based on current settings
  const calculateGasPrice = (networkBaseGas = 50) => {
    let baseGas = networkBaseGas

    if (settings.gasPreference === "low") {
      baseGas = networkBaseGas * 0.7
    } else if (settings.gasPreference === "medium") {
      baseGas = networkBaseGas
    } else if (settings.gasPreference === "high") {
      baseGas = networkBaseGas * 1.5
    } else if (settings.gasPreference === "custom") {
      baseGas = Number.parseFloat(settings.customGasPrice)
    }

    // Apply speed multiplier
    let speedMultiplier = 1
    if (settings.transactionSpeed === "economic") speedMultiplier = 0.8
    if (settings.transactionSpeed === "fast") speedMultiplier = 1.2
    if (settings.transactionSpeed === "instant") speedMultiplier = 1.5

    return baseGas * speedMultiplier * (settings.autoAdjust ? settings.gasMultiplier : 1)
  }

  return {
    settings,
    isLoaded,
    saveSettings,
    resetSettings,
    calculateGasPrice,
  }
}
