"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, User } from "lucide-react"
import type { Message } from "@/types/mission-assistant"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  // Typewriter effect for assistant messages
  useEffect(() => {
    if (message.role === "assistant") {
      setDisplayText("")
      setIsComplete(false)

      let index = 0
      const interval = setInterval(() => {
        setDisplayText(message.content.substring(0, index))
        index++

        if (index > message.content.length) {
          clearInterval(interval)
          setIsComplete(true)
        }
      }, 15) // Speed of typing

      return () => clearInterval(interval)
    } else {
      setDisplayText(message.content)
      setIsComplete(true)
    }
  }, [message])

  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            message.role === "user"
              ? "bg-cosmic-purple/30 text-cosmic-purple ml-2"
              : "bg-electric-blue/30 text-electric-blue mr-2"
          }`}
        >
          {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div
          className={`p-3 rounded-lg ${
            message.role === "user"
              ? "bg-cosmic-purple/20 border border-cosmic-purple/30"
              : "bg-electric-blue/10 border border-electric-blue/30"
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{displayText}</div>

          {/* Blinking cursor at the end of typing */}
          {message.role === "assistant" && !isComplete && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
              className="inline-block w-2 h-4 bg-electric-blue ml-1"
            />
          )}
        </div>
      </div>
    </div>
  )
}
