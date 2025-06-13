import { supabase } from "./supabase"
import { redirect } from "next/navigation"

// Function to get the current user from Supabase
export async function getCurrentUser() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.user) return null

    return session.user
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

// Auth middleware for protected routes
// In a real app, you'd use Next.js middleware more properly
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  return user
}
