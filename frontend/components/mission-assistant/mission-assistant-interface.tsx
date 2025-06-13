"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ChatSidebar } from "./chat-sidebar"
import { ChatInterface } from "./chat-interface"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useChatHistory } from "@/hooks/use-chat-history"
import { useRouter } from "next/navigation"
import type { Message, ChatSession, RouteRecommendation } from "@/types/mission-assistant"

interface MissionAssistantInterfaceProps {
  userId?: string
}

export function MissionAssistantInterface({ userId }: MissionAssistantInterfaceProps) {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 1023px)")
  const [showSidebar, setShowSidebar] = useState(!isMobile)
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { sessions, addMessage, createNewSession, updateSession } = useChatHistory(userId)

  // Initialize with welcome message
  useEffect(() => {
    if (!activeSession) {
      const initialMessage: Message = {
        id: "welcome",
        role: "assistant",
        content:
          "Hello, Pilot! I'm AstroCopilot, your mission planning assistant. How can I help optimize your interstellar journey today?",
        timestamp: new Date().toISOString(),
      }
      setMessages([initialMessage])
    }
  }, [activeSession])

  // Update sidebar visibility when screen size changes
  useEffect(() => {
    setShowSidebar(!isMobile)
  }, [isMobile])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle new session creation
  const handleNewSession = () => {
    const newSession = createNewSession()
    setActiveSession(newSession)
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hello, Pilot! I'm AstroCopilot, your mission planning assistant. How can I help optimize your interstellar journey today?",
        timestamp: new Date().toISOString(),
      },
    ])
  }

  // Handle session selection
  const handleSelectSession = (session: ChatSession) => {
    setActiveSession(session)
    setMessages(session.messages)
    if (isMobile) {
      setShowSidebar(false)
    }
  }

  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    // Create or update session
    let currentSession = activeSession
    if (!currentSession) {
      currentSession = createNewSession()
      setActiveSession(currentSession)
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    addMessage(currentSession.id, userMessage)

    // Simulate AI thinking
    setIsTyping(true)

    // Simulate AI response with delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content)
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse.text,
        timestamp: new Date().toISOString(),
        recommendation: aiResponse.recommendation,
      }

      setMessages((prev) => [...prev, assistantMessage])
      addMessage(currentSession.id, assistantMessage)
      setIsTyping(false)

      // Update session title if this is the first user message
      if (currentSession.messages.filter((m) => m.role === "user").length === 0) {
        updateSession(currentSession.id, { title: truncateTitle(content) })
      }
    }, 1500)
  }

  // Handle launching a recommended route
  const handleLaunchRoute = (recommendation: RouteRecommendation) => {
    // In a real app, this would pass the recommendation data to the launchpad
    router.push(
      `/launchpad?from=${recommendation.fromChain}&to=${recommendation.toChain}&amount=${recommendation.amount}&token=${recommendation.token}`,
    )
  }

  // Handle saving a mission
  const handleSaveMission = (recommendation: RouteRecommendation) => {
    // In a real app, this would save the mission to the user's saved routes
    alert("Mission saved to your dashboard!")
  }

  // Helper function to truncate message for title
  const truncateTitle = (message: string): string => {
    return message.length > 30 ? message.substring(0, 30) + "..." : message
  }

  // Mock AI response generator
  const generateAIResponse = (message: string): { text: string; recommendation?: RouteRecommendation } => {
    const lowerMessage = message.toLowerCase()

    // Check for route recommendation queries
    if (
      lowerMessage.includes("cheapest") ||
      lowerMessage.includes("best route") ||
      lowerMessage.includes("bridge") ||
      lowerMessage.includes("transfer") ||
      lowerMessage.includes("move")
    ) {
      // Extract token information if present
      let amount = "100"
      let token = "ETH"
      let fromChain = "arbitrum"
      let toChain = "ethereum"

      // Extract amount
      const amountMatch = message.match(/\d+(\.\d+)?/)
      if (amountMatch) {
        amount = amountMatch[0]
      }

      // Extract token
      const tokenMatch = message.match(/ETH|USDC|USDT|DAI|WBTC/i)
      if (tokenMatch) {
        token = tokenMatch[0].toUpperCase()
      }

      // Extract chains
      if (lowerMessage.includes("arbitrum")) fromChain = "arbitrum"
      if (lowerMessage.includes("optimism")) fromChain = "optimism"
      if (lowerMessage.includes("polygon")) fromChain = "polygon"
      if (lowerMessage.includes("base")) fromChain = "base"

      if (lowerMessage.includes("ethereum")) toChain = "ethereum"
      if (fromChain === "arbitrum" && !lowerMessage.includes("ethereum")) toChain = "optimism"

      // Generate recommendation
      const recommendation: RouteRecommendation = {
        fromChain,
        toChain,
        amount,
        token,
        gasCost: (Math.random() * 0.01).toFixed(4),
        estimatedTime: Math.floor(Math.random() * 10) + 2,
        riskLevel: Math.random() > 0.7 ? "Medium" : "Low",
      }

      return {
        text: `Based on current network conditions, the optimal route to transfer ${amount} ${token} from ${fromChain.charAt(0).toUpperCase() + fromChain.slice(1)} to ${toChain.charAt(0).toUpperCase() + toChain.slice(1)} would cost approximately ${recommendation.gasCost} ETH in gas fees. The estimated completion time is around ${recommendation.estimatedTime} minutes with a ${recommendation.riskLevel.toLowerCase()} risk level.`,
        recommendation,
      }
    }

    // Check for explanation queries
    if (
      lowerMessage.includes("explain") ||
      lowerMessage.includes("how does") ||
      lowerMessage.includes("what is") ||
      lowerMessage.includes("why")
    ) {
      if (lowerMessage.includes("ccip") || lowerMessage.includes("chainlink")) {
        return {
          text: "Chainlink CCIP (Cross-Chain Interoperability Protocol) is a secure interoperability solution that enables cross-chain messaging and token transfers. StarBridge uses CCIP to ensure your tokens are transferred securely between blockchains with cryptographic guarantees. This provides higher security than traditional bridges while maintaining competitive gas costs and transfer speeds.",
        }
      }

      if (lowerMessage.includes("bridge") || lowerMessage.includes("bridging")) {
        return {
          text: "Blockchain bridges allow you to transfer tokens between different networks. When you bridge tokens, they're typically locked on the source chain while an equivalent amount is minted on the destination chain. StarBridge uses Chainlink's CCIP protocol for enhanced security, pooled transfers for gas savings, and optimized routes for the best experience. Our system monitors your transfer at every step to ensure successful completion.",
        }
      }

      if (lowerMessage.includes("fail") || lowerMessage.includes("error")) {
        return {
          text: "Bridge failures can happen for several reasons: 1) Insufficient gas on the destination chain, 2) Network congestion causing timeouts, 3) Smart contract validations failing, or 4) Temporary outages in bridge infrastructure. If your mission failed, StarBridge automatically saves the parameters so you can retry with adjusted gas settings. Would you like me to help troubleshoot a specific failed mission?",
        }
      }
    }

    // Default response
    return {
      text: "I'm here to help with your cross-chain bridging needs. You can ask me about optimal routes, gas costs, bridge explanations, or troubleshooting. For example, try asking 'What's the cheapest way to bridge 100 USDC from Arbitrum to Ethereum?' or 'Explain how CCIP works.'",
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      {showSidebar && (
        <motion.div
          className="lg:w-1/4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSession?.id}
            onSelectSession={handleSelectSession}
            onNewSession={handleNewSession}
            onCloseSidebar={() => setShowSidebar(false)}
          />
        </motion.div>
      )}

      {/* Main Chat Interface */}
      <motion.div
        className="flex-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChatInterface
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          showSidebarToggle={isMobile}
          onLaunchRoute={handleLaunchRoute}
          onSaveMission={handleSaveMission}
          messagesEndRef={messagesEndRef}
        />
      </motion.div>
    </div>
  )
}
