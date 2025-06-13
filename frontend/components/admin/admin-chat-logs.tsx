"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { AIConversation } from "@/types/admin"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from "lucide-react"

interface AdminChatLogsProps {
  chats: AIConversation[]
  onFeedbackUpdate: (chatId: string, messageId: string, feedback: "helpful" | "not-helpful") => void
  onLoadMore: () => void
  isLoading: boolean
}

export function AdminChatLogs({ chats, onFeedbackUpdate, onLoadMore, isLoading }: AdminChatLogsProps) {
  const [expandedChats, setExpandedChats] = useState<Record<string, boolean>>({})

  const toggleChat = (chatId: string) => {
    setExpandedChats((prev) => ({
      ...prev,
      [chatId]: !prev[chatId],
    }))
  }

  if (chats.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No conversations found matching your filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => (
        <Card key={chat.id} className="bg-black/20 border border-gray-800 overflow-hidden">
          <div
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-black/30"
            onClick={() => toggleChat(chat.id)}
          >
            <div>
              <h3 className="font-medium">User {chat.user_id.substring(0, 8)}...</h3>
              <p className="text-sm text-gray-400">
                {new Date(chat.created_at).toLocaleString()} • {chat.messages.length} messages
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <ThumbsUp size={16} className="text-green-500" />
                <span className="text-sm">{chat.messages.filter((m) => m.feedback === "helpful").length}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsDown size={16} className="text-red-500" />
                <span className="text-sm">{chat.messages.filter((m) => m.feedback === "not-helpful").length}</span>
              </div>
              {expandedChats[chat.id] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>

          <AnimatePresence>
            {expandedChats[chat.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CardContent className="border-t border-gray-800 pt-4">
                  <div className="space-y-4">
                    {chat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg ${
                          message.role === "user"
                            ? "bg-blue-900/20 border border-blue-900/50"
                            : "bg-purple-900/20 border border-purple-900/50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">
                            {message.role === "user" ? "User" : "AI Assistant"}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">{message.content}</p>

                        {message.role === "assistant" && (
                          <div className="flex justify-end mt-2 gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`flex items-center gap-1 ${
                                message.feedback === "helpful" ? "bg-green-900/30 text-green-400" : ""
                              }`}
                              onClick={() => onFeedbackUpdate(chat.id, message.id, "helpful")}
                            >
                              <ThumbsUp size={14} />
                              <span>Helpful</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className={`flex items-center gap-1 ${
                                message.feedback === "not-helpful" ? "bg-red-900/30 text-red-400" : ""
                              }`}
                              onClick={() => onFeedbackUpdate(chat.id, message.id, "not-helpful")}
                            >
                              <ThumbsDown size={14} />
                              <span>Not Helpful</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      ))}

      <div className="flex justify-center mt-6">
        <Button onClick={onLoadMore} disabled={isLoading} variant="outline" className="border-gray-700">
          {isLoading ? "Loading..." : "Load More"}
        </Button>
      </div>
    </div>
  )
}
