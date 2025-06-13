"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, MessageSquare, X, Trash2 } from "lucide-react"
import { useState } from "react"
import type { ChatSession } from "@/types/mission-assistant"

interface ChatSidebarProps {
  sessions: ChatSession[]
  activeSessionId?: string
  onSelectSession: (session: ChatSession) => void
  onNewSession: () => void
  onCloseSidebar: () => void
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onCloseSidebar,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="bg-slate-grey/20 backdrop-blur-md rounded-lg border border-cosmic-purple/30 h-[calc(100vh-240px)] flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-cosmic-purple/30 flex items-center justify-between">
        <h3 className="font-bold text-white">Mission Conversations</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewSession}
            className="text-cosmic-purple hover:text-white hover:bg-cosmic-purple/20"
            title="New Conversation"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onCloseSidebar}
            className="text-gray-400 hover:text-white hover:bg-gray-700 md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-cosmic-purple/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-9 bg-black/60 border-cosmic-purple/30 text-white placeholder-gray-500 focus:border-cosmic-purple focus:ring-cosmic-purple/20"
          />
        </div>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <motion.button
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                session.id === activeSessionId
                  ? "bg-cosmic-purple/20 border border-cosmic-purple/30"
                  : "hover:bg-slate-grey/40"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-cosmic-purple" />
                <div className="flex-1 truncate text-sm">{session.title}</div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-1">{new Date(session.lastUpdated).toLocaleDateString()}</div>
            </motion.button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? "No matching conversations" : "No conversations yet"}
          </div>
        )}
      </div>

      {/* New Chat Button */}
      <div className="p-4 border-t border-cosmic-purple/30">
        <Button onClick={onNewSession} className="w-full bg-cosmic-purple hover:bg-cosmic-purple/80 text-white">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  )
}
