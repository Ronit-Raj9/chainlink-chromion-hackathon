"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
// Fix the import path for the Supabase client
import { supabase } from "@/lib/supabase"

export function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if user has admin role in profiles table
        const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

        if (data && data.role === "admin") {
          setIsAdmin(true)
        }
      }
    }

    checkAdminStatus()
  }, [])

  if (!isAdmin) return null

  return (
    <Link href="/admin/feedback" className="text-cosmic-purple hover:text-cosmic-purple/80 transition-colors">
      Admin
    </Link>
  )
}
