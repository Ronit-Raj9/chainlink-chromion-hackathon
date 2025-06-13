import { Starfield } from "@/components/starfield"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { requireAuth } from "@/lib/auth"

export default async function DashboardPage() {
  // This is a server component that checks auth status
  const user = await requireAuth()

  return (
    <div className="min-h-screen bg-space-black text-white relative overflow-hidden">
      <Starfield />
      <div className="pt-20 pb-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text font-orbitron">MISSION CONTROL</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-tech">
              Welcome back, Captain {user.email?.split("@")[0] || "Stargazer"}
            </p>
          </div>

          <DashboardLayout userId={user.id} />
        </div>
      </div>
    </div>
  )
}
