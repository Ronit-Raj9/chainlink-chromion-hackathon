export interface RouteRecommendation {
  fromChain: string
  toChain: string
  amount: string
  token: string
  gasCost: string
  estimatedTime: number
  riskLevel: "Low" | "Medium" | "High"
}

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  recommendation?: RouteRecommendation
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  created: string
  lastUpdated: string
}
