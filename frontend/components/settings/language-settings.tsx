"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { SettingsCard } from "./settings-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ru", name: "Russian" },
]

export function LanguageSettings() {
  const { toast } = useToast()
  const [language, setLanguage] = useState("en")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [timeFormat, setTimeFormat] = useState("12h")

  const handleSave = () => {
    // Here you would save the language settings to your backend
    toast({
      title: "Language Settings Saved",
      description: "Your language and format preferences have been updated.",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <SettingsCard
        icon={<Globe className="h-5 w-5" />}
        title="Language & Localization"
        description="Choose your preferred language and format settings"
        action={<Button onClick={handleSave}>Save Preferences</Button>}
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Interface Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-blue-950/30 border-blue-800">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-400">This will change the language used throughout the application</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date Format</label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger className="bg-blue-950/30 border-blue-800">
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Time Format</label>
            <Select value={timeFormat} onValueChange={setTimeFormat}>
              <SelectTrigger className="bg-blue-950/30 border-blue-800">
                <SelectValue placeholder="Select time format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                <SelectItem value="24h">24-hour</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-blue-800 bg-blue-950/30 p-4">
            <h4 className="mb-2 text-sm font-medium">Preview</h4>
            <div className="space-y-1 text-sm">
              <div>
                <span className="text-blue-300">Date: </span>
                <span>
                  {dateFormat === "MM/DD/YYYY" && "06/13/2025"}
                  {dateFormat === "DD/MM/YYYY" && "13/06/2025"}
                  {dateFormat === "YYYY-MM-DD" && "2025-06-13"}
                </span>
              </div>
              <div>
                <span className="text-blue-300">Time: </span>
                <span>
                  {timeFormat === "12h" && "8:32 AM"}
                  {timeFormat === "24h" && "08:32"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  )
}
