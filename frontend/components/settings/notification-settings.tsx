"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { SettingsCard } from "./settings-card"

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    bridgeCompletion: true,
    gasAlerts: true,
    securityAlerts: true,
    marketingEmails: false,
    newFeatures: true,
  })

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }))
  }

  const handleSave = () => {
    // Here you would save the notification settings to your backend
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <SettingsCard
        icon={<Bell className="h-5 w-5" />}
        title="Notification Preferences"
        description="Control how and when you receive updates and alerts"
        action={<Button onClick={handleSave}>Save Preferences</Button>}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-blue-300">Bridge Notifications</h4>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bridge-completion" className="text-sm font-medium">
                  Bridge Completion
                </Label>
                <p className="text-xs text-gray-400">Receive notifications when your bridge transactions complete</p>
              </div>
              <Switch
                id="bridge-completion"
                checked={settings.bridgeCompletion}
                onCheckedChange={() => handleToggle("bridgeCompletion")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="gas-alerts" className="text-sm font-medium">
                  Gas Price Alerts
                </Label>
                <p className="text-xs text-gray-400">Get notified when gas prices drop below your threshold</p>
              </div>
              <Switch id="gas-alerts" checked={settings.gasAlerts} onCheckedChange={() => handleToggle("gasAlerts")} />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-blue-300">Security Notifications</h4>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="security-alerts" className="text-sm font-medium">
                  Security Alerts
                </Label>
                <p className="text-xs text-gray-400">Receive notifications about security events and login attempts</p>
              </div>
              <Switch
                id="security-alerts"
                checked={settings.securityAlerts}
                onCheckedChange={() => handleToggle("securityAlerts")}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-blue-300">Marketing & Updates</h4>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails" className="text-sm font-medium">
                  Marketing Emails
                </Label>
                <p className="text-xs text-gray-400">Receive promotional emails and offers</p>
              </div>
              <Switch
                id="marketing-emails"
                checked={settings.marketingEmails}
                onCheckedChange={() => handleToggle("marketingEmails")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-features" className="text-sm font-medium">
                  New Features
                </Label>
                <p className="text-xs text-gray-400">Get notified when new features are released</p>
              </div>
              <Switch
                id="new-features"
                checked={settings.newFeatures}
                onCheckedChange={() => handleToggle("newFeatures")}
              />
            </div>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  )
}
