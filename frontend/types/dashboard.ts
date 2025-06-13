export interface UserStats {
  totalMissions: number
  successRate: string
  valueBridged: string
  gasSaved: string
  rank: string
  achievementsCount: number
  savedRoutesCount: number
  agentLogsCount: number
  chainsUsed: number
  lastMission: string
}

export interface TimelineEvent {
  title: string
  time: string
  description: string
}

export interface Mission {
  id: string
  name: string
  fromChain: string
  toChain: string
  amount: string
  token: string
  date: string
  status: string
  txHash: string
  gasSaved: string
  isStarred?: boolean
  timeline: TimelineEvent[]
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  category: string
  progress?: {
    current: number
    target: number
  }
}

export interface SavedRoute {
  id: string
  name: string
  fromChain: string
  toChain: string
  token: string
  lastUsed: string
}

export interface AgentMessage {
  sender: "user" | "agent"
  content: string
}

export interface AgentLog {
  id: string
  title: string
  date: string
  messages: AgentMessage[]
}
