export function UserStats() {
  const stats = [
    { label: "Total Bridged", value: "$12,450", color: "text-electric-blue" },
    { label: "Gas Saved", value: "0.125 ETH", color: "text-neon-green" },
    { label: "Missions", value: "23", color: "text-cosmic-purple" },
    { label: "Rank", value: "Captain", color: "text-yellow-400" },
  ]

  return (
    <div className="bg-slate-grey/20 rounded-lg border border-cosmic-purple/20 p-6">
      <h3 className="text-xl font-bold mb-4 neon-text">Pilot Stats</h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
