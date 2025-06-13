import { Badge } from "@/components/ui/badge"

const badges = [
  { name: "🌌 First Bridge", description: "Completed your first mission", earned: true },
  { name: "🚀 Speed Demon", description: "Launched 5 rockets in one day", earned: true },
  { name: "💰 Gas Saver", description: "Saved over 0.1 ETH in fees", earned: true },
  { name: "🌍 Explorer", description: "Bridged to 5 different chains", earned: false },
  { name: "👑 Captain", description: "Reached pilot rank Captain", earned: false },
]

export function Badges() {
  return (
    <div className="bg-slate-grey/20 rounded-lg border border-neon-green/20 p-6">
      <h3 className="text-xl font-bold mb-4 neon-text">Achievements</h3>

      <div className="space-y-3">
        {badges.map((badge, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all ${
              badge.earned ? "bg-neon-green/10 border-neon-green/30" : "bg-black/20 border-gray-600 opacity-50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white">{badge.name}</span>
              {badge.earned && (
                <Badge className="bg-neon-green/20 text-neon-green border-neon-green/30 text-xs">Earned</Badge>
              )}
            </div>
            <p className="text-sm text-gray-400">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
