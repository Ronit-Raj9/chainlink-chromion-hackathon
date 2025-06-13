"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface SettingsCardProps {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
  action?: ReactNode
}

export function SettingsCard({ icon, title, description, children, action }: SettingsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-lg border border-blue-800 bg-blue-950/20 backdrop-blur-sm"
    >
      <div className="flex flex-col gap-4 p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-900/50">{icon}</div>
            <div>
              <h3 className="text-lg font-medium">{title}</h3>
              <p className="text-sm text-gray-400">{description}</p>
            </div>
          </div>
          {action && <div>{action}</div>}
        </div>

        <div className="mt-2">{children}</div>
      </div>
    </motion.div>
  )
}
