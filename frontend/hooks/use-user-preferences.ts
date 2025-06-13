"use client"

import { useState, useEffect } from "react"

interface UserPreferences {
  lastSourceChain?: string
  lastTargetChain?: string
  lastToken?: string
  lastAmount?: string
  lastMissionName?: string
  lastMissionFailed?: boolean
}

export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const key = userId ? `starbridge-prefs-${userId}` : "starbridge-prefs-guest"
        const storedPrefs = localStorage.getItem(key)
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs))
        }
      } catch (error) {
        console.error("Error loading preferences:", error)
      }
    }
  }, [userId])

  // Save preferences to localStorage
  const savePreferences = (newPrefs: UserPreferences) => {
    try {
      const key = userId ? `starbridge-prefs-${userId}` : "starbridge-prefs-guest"
      localStorage.setItem(key, JSON.stringify(newPrefs))
      setPreferences(newPrefs)
    } catch (error) {
      console.error("Error saving preferences:", error)
    }
  }

  return { preferences, savePreferences }
}
