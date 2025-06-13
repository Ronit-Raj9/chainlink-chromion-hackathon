"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Rocket } from "lucide-react"
import { motion } from "framer-motion"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState("Processing authentication...")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const processAuth = async () => {
      try {
        // In a real implementation, you would handle the auth callback here
        // For now we'll just simulate a successful auth flow
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

        // Check for error
        const errorParam = searchParams.get("error")
        if (errorParam) {
          throw new Error(errorParam)
        }

        setStatus("Authentication successful!")

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } catch (err: any) {
        setError(err.message || "Authentication failed")

        // Redirect back to login after error
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }

    processAuth()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-space-black flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto p-8 bg-black/60 backdrop-blur-lg border border-electric-blue/30 rounded-lg text-center">
        <motion.div
          className="flex justify-center mb-6"
          animate={{ rotate: error ? 0 : 360 }}
          transition={{ duration: 2, repeat: error ? 0 : Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <Rocket size={48} className={error ? "text-red-500" : "text-electric-blue"} />
        </motion.div>

        <motion.h1 className="text-2xl font-orbitron mb-4 neon-text" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error ? "Authentication Failed" : "Establishing Secure Connection"}
        </motion.h1>

        <motion.div
          className={`text-lg font-tech ${error ? "text-red-400" : "text-electric-blue"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {error || status}
        </motion.div>

        {!error && (
          <div className="mt-6">
            <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-electric-blue to-cosmic-purple"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2 }}
              />
            </div>
          </div>
        )}

        {error && (
          <motion.div
            className="mt-6 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Redirecting back to login page...
          </motion.div>
        )}
      </div>
    </div>
  )
}
