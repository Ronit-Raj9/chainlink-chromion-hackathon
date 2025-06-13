"use client"

import { useState, useEffect } from "react"
import type { Message, ChatSession } from "@/types/mission-assistant"

export function useChatHistory(userId?: string) {
  const [sessions, setSessions] = useState<ChatSession[]>([])

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const key = userId ? `starbridge-chat-${userId}` : "starbridge-chat-guest"
        const storedSessions = localStorage.getItem(key)
        if (storedSessions) {
          setSessions(JSON.parse(storedSessions))
        }
      } catch (error) {
        console.error("Error loading chat history:", error)
      }
    }
  }, [userId])

  // Save sessions to localStorage
  const saveSessions = (updatedSessions: ChatSession[]) => {
    try {
      const key = userId ? `starbridge-chat-${userId}` : "starbridge-chat-guest"
      localStorage.setItem(key, JSON.stringify(updatedSessions))
      setSessions(updatedSessions)
    } catch (error) {
      console.error("Error saving chat history:", error)
    }
  }

  // Create a new chat session
  const createNewSession = (): ChatSession => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Conversation",
      messages: [],
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    }

    const updatedSessions = [newSession, ...sessions]
    saveSessions(updatedSessions)
    return newSession
  }

  // Add a message to a session
  const addMessage = (sessionId: string, message: Message) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        return {
          ...session,
          messages: [...session.messages, message],
          lastUpdated: new Date().toISOString(),
        }
      }
      return session
    })

    saveSessions(updatedSessions)
  }

  // Update session properties
  const updateSession = (sessionId: string, updates: Partial<ChatSession>) => {
    const updatedSessions = sessions.map((session) => {
      if (session.id === sessionId) {
        return {
          ...session,
          ...updates,
          lastUpdated: new Date().toISOString(),
        }
      }
      return session
    })

    saveSessions(updatedSessions)
  }

  // Delete a session
  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter((session) => session.id !== sessionId)
    saveSessions(updatedSessions)
  }

  return {
    sessions,
    createNewSession,
    addMessage,
    updateSession,
    deleteSession,
  }
}
