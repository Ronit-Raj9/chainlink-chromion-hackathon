"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

export function SoundToggle() {
  const [soundEnabled, setSoundEnabled] = useState(false)

  return (
    <div className="absolute top-4 right-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setSoundEnabled(!soundEnabled)}
        className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        <span className="ml-2 font-tech text-xs">{soundEnabled ? "SOUND ON" : "SOUND OFF"}</span>
      </Button>
    </div>
  )
}
