import { createClient } from "@supabase/supabase-js"

// Initialize the Supabase client - in production these would come from env vars
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-supabase-project.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Create a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Export the createClient function directly for components that need to create their own client
export { createClient } from "@supabase/supabase-js"
