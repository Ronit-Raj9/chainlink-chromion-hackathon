"use client"

import type React from "react"

import { useState } from "react"
import { Camera } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AvatarUpload() {
  const { toast } = useToast()
  const [avatar, setAvatar] = useState("/placeholder.svg?height=100&width=100")

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Here you would upload the file to your backend
    // For now, we'll just create a local URL
    const url = URL.createObjectURL(file)
    setAvatar(url)

    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated.",
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-24 w-24 border-2 border-blue-500">
          <AvatarImage src={avatar || "/placeholder.svg"} alt="Profile picture" />
          <AvatarFallback className="bg-blue-900 text-lg">CP</AvatarFallback>
        </Avatar>

        <label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
        >
          <Camera className="h-4 w-4" />
          <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </label>
      </div>

      <div className="text-center text-sm text-gray-400">Upload a profile picture (max 2MB)</div>
    </div>
  )
}
