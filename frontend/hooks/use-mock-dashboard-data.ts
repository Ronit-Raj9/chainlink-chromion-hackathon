"use client"

import { useState, useEffect } from "react"
import type { UserStats, Mission, Achievement, SavedRoute, AgentLog } from "@/types/dashboard"

interface DashboardData {
  stats: UserStats
  missions: Mission[]
  achievements: Achievement[]
  savedRoutes: SavedRoute[]
  agentLogs: AgentLog[]
}

export function useMockDashboardData(userId: string) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockData: DashboardData = {
          stats: {
            totalMissions: 23,
            successRate: "96%",
            valueBridged: "$12,450.75",
            gasSaved: "0.125 ETH",
            rank: "Captain",
            achievementsCount: 8,
            savedRoutesCount: 3,
            agentLogsCount: 2,
            chainsUsed: 5,
            lastMission: "2 days ago",
          },
          missions: [
            {
              id: "1",
              name: "Weekly ETH Transfer",
              fromChain: "Arbitrum",
              toChain: "Ethereum",
              amount: "0.5",
              token: "ETH",
              date: "2024-01-15 14:32",
              status: "completed",
              txHash: "0x742d35cc6bf4a8b3f4b1ff8c9848f2507c1e5e8a1a1d3c4b5e6f7a8b9c0d1e2f",
              gasSaved: "0.008 ETH",
              isStarred: true,
              timeline: [
                {
                  title: "Mission Initiated",
                  time: "14:32:05",
                  description: "Transaction submitted to Arbitrum network",
                },
                {
                  title: "Message Sent via CCIP",
                  time: "14:32:45",
                  description: "Cross-chain message sent through Chainlink CCIP",
                },
                {
                  title: "Destination Confirmation",
                  time: "14:33:12",
                  description: "Message received and validated on Ethereum",
                },
                {
                  title: "Tokens Delivered",
                  time: "14:33:30",
                  description: "0.5 ETH successfully transferred to destination wallet",
                },
              ],
            },
            {
              id: "2",
              name: "USDC to Mainnet",
              fromChain: "Polygon",
              toChain: "Ethereum",
              amount: "100",
              token: "USDC",
              date: "2024-01-12 09:15",
              status: "completed",
              txHash: "0x8a3f21bc7de5c9a6b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1",
              gasSaved: "0.012 ETH",
              isStarred: false,
              timeline: [
                {
                  title: "Mission Initiated",
                  time: "09:15:22",
                  description: "Transaction submitted to Polygon network",
                },
                {
                  title: "Message Sent via CCIP",
                  time: "09:16:05",
                  description: "Cross-chain message sent through Chainlink CCIP",
                },
                {
                  title: "Destination Confirmation",
                  time: "09:17:30",
                  description: "Message received and validated on Ethereum",
                },
                {
                  title: "Tokens Delivered",
                  time: "09:17:45",
                  description: "100 USDC successfully transferred to destination wallet",
                },
              ],
            },
            {
              id: "3",
              name: "L2 to L2 Transfer",
              fromChain: "Optimism",
              toChain: "Arbitrum",
              amount: "0.25",
              token: "ETH",
              date: "2024-01-10 16:45",
              status: "completed",
              txHash: "0x1b4e67dc8f2a3e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9d",
              gasSaved: "0.005 ETH",
              isStarred: false,
              timeline: [
                {
                  title: "Mission Initiated",
                  time: "16:45:10",
                  description: "Transaction submitted to Optimism network",
                },
                {
                  title: "Message Sent via CCIP",
                  time: "16:46:05",
                  description: "Cross-chain message sent through Chainlink CCIP",
                },
                {
                  title: "Destination Confirmation",
                  time: "16:47:22",
                  description: "Message received and validated on Arbitrum",
                },
                {
                  title: "Tokens Delivered",
                  time: "16:47:45",
                  description: "0.25 ETH successfully transferred to destination wallet",
                },
              ],
            },
            {
              id: "4",
              name: "Base to ETH",
              fromChain: "Base",
              toChain: "Ethereum",
              amount: "1.2",
              token: "ETH",
              date: "2024-01-05 11:20",
              status: "completed",
              txHash: "0x3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
              gasSaved: "0.015 ETH",
              isStarred: true,
              timeline: [
                {
                  title: "Mission Initiated",
                  time: "11:20:05",
                  description: "Transaction submitted to Base network",
                },
                {
                  title: "Message Sent via CCIP",
                  time: "11:21:15",
                  description: "Cross-chain message sent through Chainlink CCIP",
                },
                {
                  title: "Destination Confirmation",
                  time: "11:22:30",
                  description: "Message received and validated on Ethereum",
                },
                {
                  title: "Tokens Delivered",
                  time: "11:22:55",
                  description: "1.2 ETH successfully transferred to destination wallet",
                },
              ],
            },
            {
              id: "5",
              name: "Failed Transfer",
              fromChain: "Arbitrum",
              toChain: "Polygon",
              amount: "50",
              token: "USDT",
              date: "2023-12-28 13:10",
              status: "failed",
              txHash: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3",
              gasSaved: "0.000 ETH",
              isStarred: false,
              timeline: [
                {
                  title: "Mission Initiated",
                  time: "13:10:22",
                  description: "Transaction submitted to Arbitrum network",
                },
                {
                  title: "Message Sent via CCIP",
                  time: "13:11:05",
                  description: "Cross-chain message sent through Chainlink CCIP",
                },
                {
                  title: "Error Occurred",
                  time: "13:12:30",
                  description: "Destination chain rejected the message due to insufficient gas",
                },
              ],
            },
            {
              id: "6",
              name: "Pending Transfer",
              fromChain: "Ethereum",
              toChain: "Base",
              amount: "0.75",
              token: "ETH",
              date: "2024-01-17 10:05",
              status: "pending",
              txHash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
              gasSaved: "0.007 ETH",
              isStarred: false,
              timeline: [
                {
                  title: "Mission Initiated",
                  time: "10:05:15",
                  description: "Transaction submitted to Ethereum network",
                },
                {
                  title: "Message Sent via CCIP",
                  time: "10:06:30",
                  description: "Cross-chain message sent through Chainlink CCIP",
                },
                {
                  title: "Awaiting Confirmation",
                  time: "10:07:45",
                  description: "Waiting for confirmation from Base network",
                },
              ],
            },
          ],
          achievements: [
            {
              id: "1",
              name: "First Bridge",
              description: "Completed your first mission",
              icon: "🌌",
              earned: true,
              category: "bridge",
            },
            {
              id: "2",
              name: "Speed Demon",
              description: "Launched 5 rockets in one day",
              icon: "🚀",
              earned: true,
              category: "bridge",
            },
            {
              id: "3",
              name: "Gas Saver",
              description: "Saved over 0.1 ETH in fees",
              icon: "💰",
              earned: true,
              category: "savings",
            },
            {
              id: "4",
              name: "Explorer",
              description: "Bridged to 5 different chains",
              icon: "🌍",
              earned: false,
              category: "explorer",
              progress: {
                current: 4,
                target: 5,
              },
            },
            {
              id: "5",
              name: "Captain",
              description: "Reached pilot rank Captain",
              icon: "👑",
              earned: true,
              category: "bridge",
            },
            {
              id: "6",
              name: "Cosmic Traveler",
              description: "Bridged over $10,000 in total value",
              icon: "✨",
              earned: true,
              category: "savings",
            },
            {
              id: "7",
              name: "Fleet Commander",
              description: "Complete 50 successful missions",
              icon: "🛸",
              earned: false,
              category: "bridge",
              progress: {
                current: 23,
                target: 50,
              },
            },
            {
              id: "8",
              name: "Efficiency Expert",
              description: "Save 0.5 ETH in gas fees",
              icon: "⚡",
              earned: false,
              category: "savings",
              progress: {
                current: 0.125,
                target: 0.5,
              },
            },
            {
              id: "9",
              name: "Chain Collector",
              description: "Use all supported chains at least once",
              icon: "🔗",
              earned: false,
              category: "explorer",
              progress: {
                current: 5,
                target: 8,
              },
            },
          ],
          savedRoutes: [
            {
              id: "1",
              name: "Weekly ETH Bridge",
              fromChain: "Arbitrum",
              toChain: "Ethereum",
              token: "ETH",
              lastUsed: "2024-01-15",
            },
            {
              id: "2",
              name: "USDC to Mainnet",
              fromChain: "Polygon",
              toChain: "Ethereum",
              token: "USDC",
              lastUsed: "2024-01-12",
            },
            {
              id: "3",
              name: "Base to ETH",
              fromChain: "Base",
              toChain: "Ethereum",
              token: "ETH",
              lastUsed: "2024-01-05",
            },
          ],
          agentLogs: [
            {
              id: "1",
              title: "Gas Optimization Advice",
              date: "2024-01-16",
              messages: [
                {
                  sender: "user",
                  content: "What's the best time to bridge from Arbitrum to Ethereum to save on gas?",
                },
                {
                  sender: "agent",
                  content:
                    "Based on historical data, gas prices on Ethereum are typically lowest on weekends, especially Sundays between 2-6 AM UTC. For your Arbitrum to Ethereum bridge, I recommend scheduling your transfer during these hours for maximum savings.",
                },
                {
                  sender: "user",
                  content: "Can you set a reminder for me this Sunday?",
                },
                {
                  sender: "agent",
                  content:
                    "Reminder set for Sunday at 3 AM UTC. I'll send you a notification when gas prices are optimal for your bridge operation.",
                },
              ],
            },
            {
              id: "2",
              title: "Multi-chain Strategy",
              date: "2024-01-10",
              messages: [
                {
                  sender: "user",
                  content: "I need to move funds from Polygon to Base. What's the most efficient route?",
                },
                {
                  sender: "agent",
                  content:
                    "For Polygon to Base transfers, the most efficient route currently is Polygon → Ethereum → Base. While this requires two hops, the combined gas fees are 15% lower than alternative routes. Would you like me to prepare this journey for you?",
                },
                {
                  sender: "user",
                  content: "Yes, please set it up for 100 USDC.",
                },
                {
                  sender: "agent",
                  content:
                    "I've prepared a multi-hop mission for 100 USDC from Polygon to Base via Ethereum. Estimated gas savings: 0.018 ETH compared to direct routes. Ready when you are.",
                },
              ],
            },
          ],
        }

        setData(mockData)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load dashboard data. Please try again.")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userId])

  return { data, isLoading, error }
}
