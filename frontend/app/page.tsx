import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { LiveRoutes } from "@/components/live-routes"
import { Starfield } from "@/components/starfield"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <Starfield />
      <Hero />
      <Features />
      <LiveRoutes />
    </div>
  )
}
