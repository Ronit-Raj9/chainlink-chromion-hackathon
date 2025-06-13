import { Shield, Zap, Globe, Gift } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "🔐 Chainlink CCIP Security",
    description: "Military-grade cross-chain security powered by Chainlink's battle-tested infrastructure",
  },
  {
    icon: Zap,
    title: "🛰️ Pool Transfer",
    description: "Join other space travelers to share gas costs and maximize efficiency",
  },
  {
    icon: Globe,
    title: "🧪 Multi-chain Support",
    description: "Bridge between Ethereum, Arbitrum, Polygon, and more blockchain worlds",
  },
  {
    icon: Gift,
    title: "🛸 Executor Rewards",
    description: "Earn rewards by initiating rocket launches when starships are ready",
  },
]

export function Features() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 neon-text">Mission Features</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Advanced technology for seamless interstellar token transfers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-slate-grey/20 border border-electric-blue/20 hover:border-electric-blue/40 transition-all duration-300 hover:neon-glow group"
            >
              <feature.icon className="h-12 w-12 text-electric-blue mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
