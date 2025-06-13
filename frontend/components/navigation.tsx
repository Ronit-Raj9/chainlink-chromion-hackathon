"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, Rocket } from "lucide-react"
import { ConnectWallet } from "./connect-wallet"
import { UserMenu } from "./user-menu"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AdminNavLink } from "./admin/admin-nav-link"
// Fix the import path for the Supabase client
import { supabase } from "@/lib/supabase"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setIsLoading(false)
    }

    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-electric-blue/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-electric-blue" />
            <span className="text-xl font-bold neon-text">StarBridge</span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/" className="hover:text-electric-blue transition-colors">
                Launchpad
              </Link>
              <Link href="/routes" className="hover:text-electric-blue transition-colors">
                Routes
              </Link>
              <Link href="/dashboard" className="hover:text-electric-blue transition-colors">
                Dashboard
              </Link>
              <Link href="/mission-assistant" className="hover:text-electric-blue transition-colors">
                AI Assistant
              </Link>
              <AdminNavLink />
            </div>
          </div>

          <div className="hidden md:block">
            {isLoading ? (
              <motion.div
                className="w-32 h-10 bg-slate-grey/20 rounded-md"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
              />
            ) : user ? (
              <UserMenu user={{ name: user.email?.split("@")[0] || "User", email: user.email || "" }} />
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10"
                  >
                    Login
                  </Button>
                </Link>
                <ConnectWallet />
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-electric-blue hover:text-white">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/90">
            <Link href="/" className="block px-3 py-2 hover:text-electric-blue">
              Launchpad
            </Link>
            <Link href="/routes" className="block px-3 py-2 hover:text-electric-blue">
              Routes
            </Link>
            <Link href="/dashboard" className="block px-3 py-2 hover:text-electric-blue">
              Dashboard
            </Link>
            <Link href="/mission-assistant" className="block px-3 py-2 hover:text-electric-blue">
              AI Assistant
            </Link>
            <div className="px-3 py-2">
              {user ? (
                <div className="flex flex-col space-y-2">
                  <div className="text-sm text-gray-400">Signed in as {user.email}</div>
                  <Link href="/dashboard">
                    <Button
                      size="sm"
                      className="w-full bg-electric-blue/20 hover:bg-electric-blue/30 text-electric-blue"
                    >
                      View Dashboard
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-gray-700 text-gray-400 hover:bg-gray-800"
                    onClick={async () => {
                      await supabase.auth.signOut()
                      setIsOpen(false)
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/login" className="w-full">
                    <Button size="sm" className="w-full bg-electric-blue hover:bg-electric-blue/80 text-black">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-cosmic-purple text-cosmic-purple hover:bg-cosmic-purple/20"
                    >
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
