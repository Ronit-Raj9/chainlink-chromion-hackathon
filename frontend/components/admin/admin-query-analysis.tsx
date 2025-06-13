"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AIConversation } from "@/types/admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"

interface AdminQueryAnalysisProps {
  chats: AIConversation[]
}

interface QueryFrequency {
  query: string
  count: number
}

interface FeedbackDistribution {
  name: string
  value: number
}

export function AdminQueryAnalysis({ chats }: AdminQueryAnalysisProps) {
  const [commonQueries, setCommonQueries] = useState<QueryFrequency[]>([])
  const [feedbackDistribution, setFeedbackDistribution] = useState<FeedbackDistribution[]>([])
  const [queryLengthDistribution, setQueryLengthDistribution] = useState<{ name: string; value: number }[]>([])

  useEffect(() => {
    // Process common queries
    const queryMap = new Map<string, number>()

    chats.forEach((chat) => {
      chat.messages.forEach((msg) => {
        if (msg.role === "user") {
          // Normalize the query by converting to lowercase and removing extra spaces
          const normalizedQuery = msg.content.toLowerCase().trim()
          queryMap.set(normalizedQuery, (queryMap.get(normalizedQuery) || 0) + 1)
        }
      })
    })

    // Convert map to array and sort by frequency
    const sortedQueries = Array.from(queryMap.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 queries

    setCommonQueries(sortedQueries)

    // Process feedback distribution
    const helpfulCount = chats.reduce(
      (acc, chat) => acc + chat.messages.filter((m) => m.role === "assistant" && m.feedback === "helpful").length,
      0,
    )

    const unhelpfulCount = chats.reduce(
      (acc, chat) => acc + chat.messages.filter((m) => m.role === "assistant" && m.feedback === "not-helpful").length,
      0,
    )

    const noFeedbackCount = chats.reduce(
      (acc, chat) => acc + chat.messages.filter((m) => m.role === "assistant" && !m.feedback).length,
      0,
    )

    setFeedbackDistribution([
      { name: "Helpful", value: helpfulCount },
      { name: "Unhelpful", value: unhelpfulCount },
      { name: "No Feedback", value: noFeedbackCount },
    ])

    // Process query length distribution
    const queryLengths = {
      "Very Short (< 10 words)": 0,
      "Short (10-20 words)": 0,
      "Medium (21-50 words)": 0,
      "Long (51-100 words)": 0,
      "Very Long (> 100 words)": 0,
    }

    chats.forEach((chat) => {
      chat.messages.forEach((msg) => {
        if (msg.role === "user") {
          const wordCount = msg.content.split(/\s+/).length

          if (wordCount < 10) queryLengths["Very Short (< 10 words)"]++
          else if (wordCount < 20) queryLengths["Short (10-20 words)"]++
          else if (wordCount < 50) queryLengths["Medium (21-50 words)"]++
          else if (wordCount < 100) queryLengths["Long (51-100 words)"]++
          else queryLengths["Very Long (> 100 words)"]++
        }
      })
    })

    setQueryLengthDistribution(Object.entries(queryLengths).map(([name, value]) => ({ name, value })))
  }, [chats])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="common-queries" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="common-queries">Common Queries</TabsTrigger>
          <TabsTrigger value="feedback-distribution">Feedback Distribution</TabsTrigger>
          <TabsTrigger value="query-length">Query Length</TabsTrigger>
        </TabsList>

        <TabsContent value="common-queries">
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle>Most Common User Queries</CardTitle>
            </CardHeader>
            <CardContent>
              {commonQueries.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={commonQueries}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis type="number" />
                      <YAxis
                        type="category"
                        dataKey="query"
                        width={250}
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => (value.length > 30 ? `${value.substring(0, 30)}...` : value)}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }}
                        formatter={(value, name, props) => [value, "Frequency"]}
                        labelFormatter={(label) => `Query: ${label}`}
                      />
                      <Bar dataKey="count" fill="#8884d8">
                        {commonQueries.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No query data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback-distribution">
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle>Feedback Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {feedbackDistribution.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {feedbackDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }}
                        formatter={(value, name, props) => [value, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No feedback data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="query-length">
          <Card className="bg-black/20 border border-gray-800">
            <CardHeader>
              <CardTitle>Query Length Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              {queryLengthDistribution.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={queryLengthDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }}
                        formatter={(value, name, props) => [value, "Count"]}
                      />
                      <Bar dataKey="value" fill="#8884d8">
                        {queryLengthDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No query length data available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
