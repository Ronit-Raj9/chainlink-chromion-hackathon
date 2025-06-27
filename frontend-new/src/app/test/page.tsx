export default function TestPage() {
  return (
    <div className="min-h-screen bg-space-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold font-orbitron mb-4">
          <span className="bg-hero-gradient bg-clip-text text-transparent">
            Tailwind CSS
          </span>
        </h1>
        <p className="text-xl text-gray-300 font-tech mb-8">
          Test page - If you see styled text, Tailwind is working!
        </p>
        <div className="flex space-x-4 justify-center">
          <div className="w-16 h-16 bg-electric-blue rounded-lg animate-pulse"></div>
          <div className="w-16 h-16 bg-cosmic-purple rounded-lg animate-bounce"></div>
          <div className="w-16 h-16 bg-neon-cyan rounded-lg animate-spin"></div>
        </div>
        <button className="mt-8 bg-gradient-to-r from-electric-blue to-cosmic-purple text-white px-8 py-4 rounded-lg font-tech font-semibold hover:scale-105 transition-transform">
          Tailwind is Working! 🎉
        </button>
      </div>
    </div>
  )
} 