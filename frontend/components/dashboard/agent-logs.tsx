"use client"

import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { MessageSquare, Bot, User, ArrowRight } from "lucide-react"
import type { AgentLog } from "@/types/dashboard"

interface AgentLogsProps {
  agentLogs?: AgentLog[]
  isLoading: boolean
}

export function AgentLogs({ agentLogs, isLoading }: AgentLogsProps) {
  return (
    <div className="bg-slate-grey/20 rounded-lg border border-electric-blue/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold neon-text font-orbitron">AI Mission Assistant</h3>
        <Button
          size="sm"
          variant="outline"
          className="border-electric-blue text-electric-blue hover:bg-electric-blue/10"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          New Chat
        </Button>
      </div>

      {isLoading ? (
        // Loading skeletons
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-black/40 rounded-lg border border-gray-800">
              <div className="flex items-start space-x-3 mb-3">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-grey/40" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-grey/40" />
                  <Skeleton className="h-3 w-full bg-slate-grey/40" />
                  <Skeleton className="h-3 w-3/4 bg-slate-grey/40" />
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-grey/40" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-grey/40" />
                  <Skeleton className="h-3 w-full bg-slate-grey/40" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : agentLogs && agentLogs.length > 0 ? (
        // Agent logs list
        <div className="space-y-4">
          {agentLogs.map((log, index) => (
            <motion.div
              key={log.id}
              className="p-4 bg-black/40 rounded-lg border border-electric-blue/20 hover:border-electric-blue/40 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-white">{log.title}</h4>
                <div className="text-xs text-gray-400 font-tech">{log.date}</div>
              </div>

              <div className="space-y-4">
                {log.messages.slice(0, 2).map((message, i) => (
                  <div key={i} className="flex space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === "user"
                          ? "bg-cosmic-purple/30 text-cosmic-purple"
                          : "bg-electric-blue/30 text-electric-blue"
                      }`}
                    >
                      {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-1">
                        {message.sender === "user" ? "You" : "AI Assistant"}
                      </div>
                      <div className="text-white">{message.content}</div>
                    </div>
                  </div>
                ))}

                {log.messages.length > 2 && (
                  <div className="text-center text-sm text-gray-400">+ {log.messages.length - 2} more messages</div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button size="sm" variant="ghost" className="text-electric-blue hover:bg-electric-blue/10">
                  Continue Chat
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        // Empty state
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🤖</div>
          <h4 className="text-lg font-bold text-white mb-2">No AI Conversations Yet</h4>
          <p className="text-gray-400 mb-4">Chat with our AI assistant to optimize your bridge missions</p>
          <Button className="bg-electric-blue hover:bg-electric-blue/80 text-black font-bold">
            <Bot className="h-4 w-4 mr-2" />
            Start Conversation
          </Button>
        </div>
      )}
    </div>
  )
}
