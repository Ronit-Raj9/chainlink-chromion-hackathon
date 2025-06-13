import { MissionControl } from "@/components/mission-control"
import { EnhancedStarfield } from "@/components/enhanced-starfield"

export default function RoutesPage() {
  return (
    <div className="min-h-screen bg-space-black text-white relative overflow-hidden">
      <EnhancedStarfield />
      <MissionControl />
    </div>
  )
}
