"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"

export function ConnectWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  const connectWallet = async () => {
    // Mock wallet connection
    setIsConnected(true)
    setAddress("0x742d...4A8B")
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
  }

  if (isConnected) {
    return (
      <Button
        onClick={disconnectWallet}
        variant="outline"
        className="border-electric-blue text-electric-blue hover:bg-electric-blue hover:text-black font-tech"
      >
        <Wallet className="h-4 w-4 mr-2" />
        {address}
      </Button>
    )
  }

  return (
    <Button
      onClick={connectWallet}
      className="bg-electric-blue hover:bg-electric-blue/80 text-black font-bold neon-glow"
    >
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
