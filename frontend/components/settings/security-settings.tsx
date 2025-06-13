"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Shield, Key, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { SettingsCard } from "./settings-card"

export function SecuritySettings() {
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Your new password and confirmation do not match.",
        variant: "destructive",
      })
      return
    }

    // Here you would update the password in your backend
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    })
    setShowPasswordForm(false)
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })
  }

  const handleToggle2FA = () => {
    // Here you would enable/disable 2FA in your backend
    setTwoFactorEnabled(!twoFactorEnabled)
    toast({
      title: twoFactorEnabled ? "2FA Disabled" : "2FA Enabled",
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled.",
    })
  }

  const handleLogout = () => {
    // Here you would log the user out
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    // Redirect to login page
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="space-y-6">
        <SettingsCard
          icon={<Key className="h-5 w-5" />}
          title="Password"
          description="Update your password to keep your account secure"
          action={
            showPasswordForm ? (
              <Button variant="outline" onClick={() => setShowPasswordForm(false)}>
                Cancel
              </Button>
            ) : (
              <Button onClick={() => setShowPasswordForm(true)}>Change Password</Button>
            )
          }
        >
          {showPasswordForm ? (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="bg-blue-950/30 border-blue-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  required
                  className="bg-blue-950/30 border-blue-800"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  className="bg-blue-950/30 border-blue-800"
                />
              </div>

              <Button type="submit">Update Password</Button>
            </form>
          ) : (
            <div className="text-sm">
              Your password was last changed 30 days ago. We recommend changing your password regularly.
            </div>
          )}
        </SettingsCard>

        <SettingsCard
          icon={<Shield className="h-5 w-5" />}
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          action={<Button onClick={handleToggle2FA}>{twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}</Button>}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa-toggle" className="text-sm font-medium">
                  Two-Factor Authentication
                </Label>
                <p className="text-xs text-gray-400">Require a verification code when logging in</p>
              </div>
              <Switch id="2fa-toggle" checked={twoFactorEnabled} onCheckedChange={handleToggle2FA} />
            </div>

            {twoFactorEnabled && (
              <div className="rounded-md border border-green-800 bg-green-950/30 p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="text-sm font-medium text-green-500">Your account is protected</h4>
                    <p className="text-xs text-gray-400">
                      Two-factor authentication is currently enabled for your account.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!twoFactorEnabled && (
              <div className="rounded-md border border-yellow-800 bg-yellow-950/30 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-500">Your account is vulnerable</h4>
                    <p className="text-xs text-gray-400">Enable two-factor authentication for enhanced security.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SettingsCard>

        <SettingsCard
          icon={<AlertTriangle className="h-5 w-5" />}
          title="Account Actions"
          description="Log out or perform other account-related actions"
        >
          <div className="space-y-4">
            <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
              Log Out of All Devices
            </Button>
          </div>
        </SettingsCard>
      </div>
    </motion.div>
  )
}
