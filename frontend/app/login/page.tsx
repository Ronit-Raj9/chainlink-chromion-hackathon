import { AuthForm } from "@/components/auth/auth-form"
import { AuthDivider } from "@/components/auth/auth-divider"
import { WalletConnectButton } from "@/components/auth/wallet-connect-button"
import { PlanetAnimation } from "@/components/auth/planet-animation"
import { CosmicParticles } from "@/components/auth/cosmic-particles"
import { Rocket } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-space-black text-white flex flex-col">
      {/* Header with minimal navigation */}
      <header className="relative z-10 py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Rocket className="h-8 w-8 text-electric-blue" />
          <span className="text-xl font-bold neon-text">StarBridge</span>
        </Link>
        <Link href="/" className="text-electric-blue hover:text-white transition-colors">
          Return to Home
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {/* Left side: Authentication form */}
          <div className="w-full lg:w-1/2 p-8 bg-black/40 backdrop-blur-lg rounded-lg border border-electric-blue/20">
            <AuthForm />
            <AuthDivider />
            <WalletConnectButton />

            <div className="mt-6 text-center text-xs text-gray-500 font-tech">
              By continuing, you agree to StarBridge's{" "}
              <Link href="/terms" className="text-electric-blue hover:text-white">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-electric-blue hover:text-white">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Right side: Planet visualization - hidden on mobile */}
          <div className="hidden lg:block lg:w-1/2 pl-12">
            <div className="relative h-full">
              <PlanetAnimation />
            </div>
          </div>
        </div>

        {/* Background particles */}
        <div className="absolute inset-0 pointer-events-none">
          <CosmicParticles />
        </div>
      </div>
    </div>
  )
}
