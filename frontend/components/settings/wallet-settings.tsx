"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { SettingsCard } from "./settings-card"

export function WalletSettings() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(true)
  const [walletAddress, setWalletAddress] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")

  const handleConnect = () => {
    // Here you would connect to the wallet
    setIsConnected(true)
    setWalletAddress("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")
    toast({
      title: "Wallet Connected",
      description: "Your wallet has been successfully connected.",
    })
  }

  const handleDisconnect = () => {
    // Here you would disconnect the wallet
    setIsConnected(false)
    setWalletAddress("")
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress)
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard.",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <SettingsCard
        icon={<Wallet className="h-5 w-5" />}
        title="Connected Wallet"
        description="Manage your connected wallet and view transaction history"
        action={
          isConnected ? (
            <Button variant="destructive" onClick={handleDisconnect}>
              Disconnect Wallet
            </Button>
          ) : (
            <Button onClick={handleConnect}>Connect Wallet</Button>
          )
        }
      >
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
            <span className="text-sm font-medium">{isConnected ? "Connected" : "Not Connected"}</span>
          </div>

          {isConnected && (
            <div className="space-y-4">
              <div className="rounded-lg border border-blue-800 bg-blue-950/30 p-4">
                <div className="mb-2 text-sm text-blue-300">Wallet Address</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 overflow-hidden text-ellipsis font-mono text-sm">{walletAddress}</code>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    as="a"
                    href={`https://etherscan.io/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Default Networks</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="rounded-md border border-blue-800 bg-blue-950/30 p-3">
                    <div className="text-xs text-blue-300">Source Chain</div>
                    <div className="text-sm">Ethereum Mainnet</div>
                  </div>
                  <div className="rounded-md border border-blue-800 bg-blue-950/30 p-3">
                    <div className="text-xs text-blue-300">Destination Chain</div>
                    <div className="text-sm">Optimism</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SettingsCard>
    </motion.div>
  )
}
