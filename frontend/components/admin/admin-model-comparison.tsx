"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export function AdminModelComparison() {
  const [userPrompt, setUserPrompt] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [modelResponses, setModelResponses] = useState<
    {
      model: string
      response: string
      latency: number
    }[]
  >([])
  const { toast } = useToast()

  const models = [
    { id: "gpt-4o", name: "GPT-4o" },
    { id: "claude-3-opus", name: "Claude 3 Opus" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B" },
  ]

  const runComparison = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to compare models.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setModelResponses([])

    try {
      // This would normally call your AI services
      // For demo purposes, we'll simulate responses
      const mockResponses = [
        {
          model: "GPT-4o",
          response: `Based on current gas prices and bridge conditions, here's my analysis:

🚀 **Recommended Route: Ethereum → Arbitrum via CCIP**
- Gas Cost: ~0.0021 ETH ($3.78)
- Estimated Time: 3-5 minutes
- Risk Level: Low

This route offers the optimal balance between cost and speed. The CCIP protocol ensures secure message passing between chains with cryptographic verification.

Alternative options:
1. Ethereum → Arbitrum Bridge (Official): Higher gas (~$5.20), similar time
2. Ethereum → Hop Protocol → Arbitrum: Slightly higher gas (~$4.50), similar time

Would you like me to prepare this mission for launch?`,
          latency: 1.2,
        },
        {
          model: "Claude 3 Opus",
          response: `I've analyzed the current bridge options from Ethereum to Arbitrum for you.

The most cost-effective route currently is:

**RECOMMENDED ROUTE**
* Source: Ethereum Mainnet
* Destination: Arbitrum One
* Protocol: CCIP (Cross-Chain Interoperability Protocol)
* Current Gas Cost: Approximately 0.0023 ETH ($4.14)
* Estimated Completion Time: 3-5 minutes
* Security Rating: High

This route leverages Chainlink's CCIP infrastructure which provides strong security guarantees through their OCR (Off-Chain Reporting) system and multiple validator nodes.

Would you like me to explain more about how this bridge works or would you prefer to proceed with this route?`,
          latency: 1.5,
        },
        {
          model: "Mixtral 8x7B",
          response: `For bridging from Ethereum to Arbitrum, here's the most cost-effective option:

ROUTE DETAILS:
- Origin: Ethereum
- Destination: Arbitrum
- Method: CCIP Bridge
- Gas fee: ~0.0025 ETH ($4.50)
- Time: 4-6 minutes
- Risk: Low

This route uses Chainlink's Cross-Chain Interoperability Protocol which has strong security features and reasonable gas costs.

Alternative options include the official Arbitrum bridge (slightly higher gas) or Hop Protocol (similar gas but may have additional fees).

Would you like to proceed with this route?`,
          latency: 0.9,
        },
      ]

      // Simulate API calls with different timings
      for (const mockResponse of mockResponses) {
        await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000))
        setModelResponses((prev) => [...prev, mockResponse])
      }
    } catch (error) {
      console.error("Error comparing models:", error)
      toast({
        title: "Error",
        description: "Failed to compare models. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/20 border border-gray-800">
        <CardHeader>
          <CardTitle>Model Comparison</CardTitle>
          <CardDescription>Compare responses from different AI models to the same prompt.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Test Prompt</label>
              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full h-24 p-4 bg-black/30 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="E.g., What's the cheapest way to bridge from Ethereum to Arbitrum?"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={runComparison} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                {isLoading ? "Comparing Models..." : "Compare Models"}
              </Button>
            </div>

            {modelResponses.length > 0 && (
              <div className="mt-6 space-y-6">
                {modelResponses.map((response, index) => (
                  <Card key={index} className="bg-black/30 border border-gray-700">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{response.model}</CardTitle>
                        <span className="text-sm text-gray-400">Latency: {response.latency.toFixed(2)}s</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-black/20 rounded-md whitespace-pre-wrap">{response.response}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
