"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { SettingsCard } from "./settings-card"
import { AvatarUpload } from "./avatar-upload"

export function ProfileSettings() {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: "CosmicPilot42",
    email: "pilot@starbridge.io",
    bio: "Exploring the multi-chain universe one bridge at a time.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would save the data to your backend
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    })
    setIsEditing(false)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <SettingsCard
        icon={<User className="h-5 w-5" />}
        title="Profile Information"
        description="Manage your personal information and how it appears to others"
        action={
          isEditing ? (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )
        }
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <AvatarUpload />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className="bg-blue-950/30 border-blue-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="bg-blue-950/30 border-blue-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows={3}
                className="w-full rounded-md border border-blue-800 bg-blue-950/30 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  )
}
