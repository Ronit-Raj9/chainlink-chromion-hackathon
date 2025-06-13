export interface AIMessage {
  id: string
  conversation_id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  feedback?: "helpful" | "not-helpful"
}

export interface AIConversation {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  messages: AIMessage[]
}

export interface AdminStats {
  totalConversations: number
  totalMessages: number
  helpfulResponses: number
  unhelpfulResponses: number
}
