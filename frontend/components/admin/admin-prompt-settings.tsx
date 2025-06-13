"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function AdminPromptSettings() {
  const [systemPrompt, setSystemPrompt] = useState<string>(
    `You are AstroCopilot, the AI assistant for StarBridge, a cross-chain bridge platform with a space theme. 
Your goal is to help users navigate cross-chain transfers, understand bridge technology, and optimize their transactions.

When responding to users:
1. Be knowledgeable about blockchain bridges, especially CCIP (Cross-Chain Interoperability Protocol)
2. Provide specific route recommendations when asked about transfers between chains
3. Include gas costs, estimated time, and risk assessments when suggesting routes
4. Maintain the cosmic/space theme in your responses
5. Be concise but informative
6. When suggesting routes, format them in a way that's easy to read and understand`,
  )

  const [testPrompt, setTestPrompt] = useState<string>("")
  const [testResponse, setTestResponse] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const saveSystemPrompt = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.from("ai_settings").update({ value: systemPrompt }).eq("key", "system_prompt")

      if (error) throw error

      toast({
        title: "System prompt updated",
        description: "The AI assistant will now use the new system prompt.",
      })
    } catch (error) {
      console.error("Error saving system prompt:", error)
      toast({
        title: "Error",
        description: "Failed to update system prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testSystemPrompt = async () => {
    if (!testPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a test prompt.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setTestResponse("")

    try {
      // This would normally call your AI service
      // For demo purposes, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setTestResponse(
        `Based on your query "${testPrompt}", here's my response as AstroCopilot:

Hello cosmic traveler! I've analyzed the current bridge routes for your journey.

🚀 **Recommended Route**
- Origin: Ethereum
- Destination: Arbitrum
- Estimated Gas: 0.0023 ETH ($4.12)
- ETA: ~3 minutes
- Risk Level: Low

Would you like me to prepare this mission for launch, or would you prefer to explore alternative routes?`,
      )
    } catch (error) {
      console.error("Error testing system prompt:", error)
      toast({
        title: "Error",
        description: "Failed to test system prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="system-prompt" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="system-prompt">System Prompt</TabsTrigger>
          <TabsTrigger value="test-prompt">Test Prompt</TabsTrigger>
        </TabsList>

        <TabsContent value="system-prompt">
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle>System Prompt Configuration</CardTitle>
              <CardDescription>
                This is the base instruction set given to the AI assistant. It defines the assistant's personality,
                knowledge, and behavior.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full h-80 p-4 bg-black/30 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="Enter system prompt..."
                />
                <div className="flex justify-end">
                  <Button onClick={saveSystemPrompt} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? "Saving..." : "Save System Prompt"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test-prompt">
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle>Test Your System Prompt</CardTitle>
              <CardDescription>
                Enter a test user message to see how the AI assistant would respond with the current system prompt.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Test User Message</label>
                  <textarea
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    className="w-full h-24 p-4 bg-black/30 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="E.g., What's the best way to bridge ETH from Ethereum to Arbitrum?"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={testSystemPrompt} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                    {isLoading ? "Testing..." : "Test Response"}
                  </Button>
                </div>

                {testResponse && (
                  <div className="mt-6">
                    <label className="text-sm text-gray-400 mb-1 block">AI Response</label>
                    <div className="p-4 bg-purple-900/20 border border-purple-900/50 rounded-md whitespace-pre-wrap">
                      {testResponse}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
