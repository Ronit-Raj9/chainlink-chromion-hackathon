"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { User, LogOut, Settings, History, ChevronDown } from "lucide-react"

interface UserMenuProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function UserMenu({ user = { name: "Space Traveler", email: "user@example.com" } }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()

      toast({
        title: "Logged out successfully",
        description: "Your session has ended. Safe travels!",
        variant: "cosmic",
      })

      router.push("/")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again.",
      })
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-slate-grey/30 rounded-full pl-2 pr-3 py-1 hover:bg-slate-grey/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-electric-blue/30 flex items-center justify-center">
          {user.avatar ? (
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full rounded-full" />
          ) : (
            <User size={16} className="text-electric-blue" />
          )}
        </div>
        <span className="text-sm hidden md:block font-tech">{user.name}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-electric-blue/30 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-3 border-b border-gray-800">
              <div className="font-semibold text-white">{user.name}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>

            <div className="py-1">
              <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800">
                <History size={16} className="mr-2 text-electric-blue" />
                Mission History
              </Link>
              <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800">
                <Settings size={16} className="mr-2 text-electric-blue" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
              >
                <LogOut size={16} className="mr-2 text-cosmic-purple" />
                Sign out
              </button>
            </div>

            {/* Decorative border */}
            <div className="h-1 bg-gradient-to-r from-electric-blue to-cosmic-purple"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
