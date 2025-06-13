"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Menu } from "lucide-react"
import { MessageBubble } from "./message-bubble"
import { TypingIndicator } from "./typing-indicator"
import { RouteCard } from "./route-card"
import type { Message, RouteRecommendation } from "@/types/mission-assistant"

interface ChatInterfaceProps {
  messages: Message[]
  isTyping: boolean
  onSendMessage: (message: string) => void
  onToggleSidebar: () => void
  showSidebarToggle: boolean
  onLaunchRoute: (recommendation: RouteRecommendation) => void
  onSaveMission: (recommendation: RouteRecommendation) => void
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export function ChatInterface({
  messages,
  isTyping,
  onSendMessage,
  onToggleSidebar,
  showSidebarToggle,
  onLaunchRoute,
  onSaveMission,
  messagesEndRef,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue("")
    }
  }

  return (
    <div className="bg-slate-grey/20 backdrop-blur-md rounded-lg border border-electric-blue/30 h-[calc(100vh-240px)] flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-electric-blue/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showSidebarToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleSidebar}
              className="text-electric-blue hover:text-white hover:bg-electric-blue/20"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-cosmic-purple/30 flex items-center justify-center">
              <span className="text-cosmic-purple text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-white">AstroCopilot</h3>
              <div className="text-xs text-electric-blue">Online</div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-400 font-tech">Powered by StarBridge AI</div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble message={message} />

              {/* Route Recommendation Card */}
              {message.recommendation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="mt-2 ml-12"
                >
                  <RouteCard
                    recommendation={message.recommendation}
                    onLaunch={() => onLaunchRoute(message.recommendation!)}
                    onSave={() => onSaveMission(message.recommendation!)}
                  />
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <TypingIndicator />
          </motion.div>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-electric-blue/30">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about bridge routes, gas costs, or how CCIP works..."
            className="bg-black/60 border-electric-blue/30 text-white placeholder-gray-500 focus:border-electric-blue focus:ring-electric-blue/20"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="bg-cosmic-purple hover:bg-cosmic-purple/80 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          AstroCopilot provides route suggestions based on current network conditions
        </div>
      </form>
    </div>
  )
}
