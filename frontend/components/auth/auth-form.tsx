"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Rocket, Mail, Lock, Loader } from "lucide-react"

type AuthMode = "login" | "signup"

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "Welcome aboard, stargazer!",
          description: "Please check your email to verify your account.",
          variant: "cosmic",
        })

        // Automatically switch to login mode
        setMode("login")
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "Access granted!",
          description: "Welcome back to StarBridge.",
          variant: "cosmic",
        })

        // Redirect to dashboard
        router.push("/dashboard")
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6">
        <motion.div
          className="text-3xl font-bold mb-1 font-orbitron neon-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {mode === "login" ? "Mission Access" : "Register New Pilot"}
        </motion.div>
        <motion.p
          className="text-gray-400 font-tech"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {mode === "login" ? "Enter your credentials to continue" : "Join the interstellar community"}
        </motion.p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-electric-blue font-tech">NAVIGATION ID</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 bg-black/60 border-electric-blue/30 text-white placeholder-gray-500 font-tech focus:border-electric-blue focus:ring-electric-blue/20"
              />
              <div className="absolute inset-0 rounded-md pointer-events-none border border-electric-blue/10 filter blur-[1px]"></div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-electric-blue font-tech">ACCESS KEY</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 bg-black/60 border-electric-blue/30 text-white placeholder-gray-500 font-tech focus:border-electric-blue focus:ring-electric-blue/20"
              />
              <div className="absolute inset-0 rounded-md pointer-events-none border border-electric-blue/10 filter blur-[1px]"></div>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-electric-blue to-cosmic-purple hover:from-cosmic-purple hover:to-electric-blue text-black font-bold py-3 neon-glow font-orbitron transition-all duration-300"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
            >
              <Loader className="h-5 w-5" />
            </motion.div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Rocket className="h-5 w-5" />
              <span>{mode === "login" ? "LAUNCH ACCESS" : "INITIATE REGISTRATION"}</span>
            </div>
          )}
        </Button>
      </motion.form>

      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-gray-400 font-tech">
          {mode === "login" ? "New to the galaxy?" : "Already have an account?"}
          <button
            type="button"
            onClick={toggleMode}
            className="ml-2 text-electric-blue hover:text-white transition-colors"
          >
            {mode === "login" ? "Register here" : "Access now"}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
