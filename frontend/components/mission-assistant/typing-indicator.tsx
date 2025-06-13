"use client"

import { motion } from "framer-motion"
import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex items-start">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-electric-blue/30 flex items-center justify-center mr-2">
        <Bot className="h-4 w-4 text-electric-blue" />
      </div>
      <div className="p-3 rounded-lg bg-electric-blue/10 border border-electric-blue/30 inline-flex items-center">
        <motion.div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-electric-blue"
              animate={{
                y: ["0%", "-50%", "0%"],
              }}
              transition={{
                duration: 0.8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                delay: i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
