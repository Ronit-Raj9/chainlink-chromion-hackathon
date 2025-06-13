"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Loader } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

// Simulating wallet connection for now
// In a real implementation, you would use wagmi/RainbowKit or similar
export function WalletConnectButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const connectWallet = async () => {
    setIsConnecting(true)

    // Simulate wallet connection
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Wallet connected!",
        description: "Successfully connected to 0x742d...4A8B",
        variant: "cosmic",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection failed",
        description: "Could not connect to wallet. Please try again.",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <Button
      onClick={connectWallet}
      disabled={isConnecting}
      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 font-bold py-3 transition-all duration-300 group relative overflow-hidden"
    >
      <motion.span
        className="absolute inset-0 w-full h-full bg-gradient-to-r from-electric-blue/20 to-cosmic-purple/20"
        initial={{ x: "-100%" }}
        animate={{ x: isConnecting ? "0%" : "-100%" }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="flex items-center justify-center space-x-2"
        animate={isConnecting ? { scale: [1, 1.05, 1] } : {}}
        transition={{ repeat: isConnecting ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
      >
        {isConnecting ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
          >
            <Loader className="h-5 w-5" />
          </motion.div>
        ) : (
          <Wallet className="h-5 w-5 group-hover:scale-110 transition-transform" />
        )}
        <span className="font-tech">{isConnecting ? "CONNECTING..." : "CONNECT WALLET"}</span>
      </motion.div>
    </Button>
  )
}
