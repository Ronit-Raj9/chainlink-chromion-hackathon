"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { WalletSettings } from "./wallet-settings"
import { NotificationSettings } from "./notification-settings"
import { LanguageSettings } from "./language-settings"
import { SecuritySettings } from "./security-settings"
import { TransactionSettings } from "./transaction-settings"
import { EnhancedStarfield } from "@/components/enhanced-starfield"

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      <EnhancedStarfield className="absolute inset-0 z-0" />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Mission Control Settings</h1>
          <p className="mb-8 text-lg text-blue-300">Customize your StarBridge experience and manage your account</p>
        </motion.div>

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-900/50">
              Profile
            </TabsTrigger>
            <TabsTrigger value="wallet" className="data-[state=active]:bg-blue-900/50">
              Wallet
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-blue-900/50">
              Transactions
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-900/50">
              Notifications
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-blue-900/50">
              Language
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-blue-900/50">
              Security
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="profile" className="mt-0">
              <ProfileSettings />
            </TabsContent>
            <TabsContent value="wallet" className="mt-0">
              <WalletSettings />
            </TabsContent>
            <TabsContent value="transactions" className="mt-0">
              <TransactionSettings />
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="language" className="mt-0">
              <LanguageSettings />
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <SecuritySettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
