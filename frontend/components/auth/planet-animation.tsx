"use client"

import { motion } from "framer-motion"

export function PlanetAnimation() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background stars */}
      <div className="absolute inset-0 opacity-70">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 1,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Orbiting rings */}
      <motion.div
        className="absolute w-[400px] h-[400px] border border-electric-blue/20 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] border border-cosmic-purple/20 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Planet */}
      <motion.div
        className="relative w-40 h-40"
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-electric-blue/80 to-cosmic-purple overflow-hidden shadow-lg relative">
          {/* Planet surface texture */}
          <div className="absolute inset-0 opacity-30">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-black/20 rounded-full"
                style={{
                  width: `${Math.random() * 30 + 5}px`,
                  height: `${Math.random() * 30 + 5}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* Planet glow */}
          <div className="absolute -inset-2 bg-electric-blue/20 rounded-full filter blur-xl opacity-60"></div>
        </div>
      </motion.div>

      {/* Orbiting moon */}
      <motion.div
        className="absolute"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <motion.div
          className="w-8 h-8 bg-neon-green rounded-full absolute"
          style={{ left: "180px" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      {/* Shooting stars */}
      <motion.div
        className="absolute w-12 h-[1px] bg-gradient-to-r from-white to-transparent"
        initial={{ top: "10%", left: "10%", rotate: -45 }}
        animate={{
          top: ["10%", "40%"],
          left: ["10%", "60%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 8,
        }}
      />

      <motion.div
        className="absolute w-16 h-[1px] bg-gradient-to-r from-white to-transparent"
        initial={{ top: "70%", left: "80%", rotate: -45 }}
        animate={{
          top: ["70%", "90%"],
          left: ["80%", "20%"],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 6,
          delay: 4,
        }}
      />
    </div>
  )
}
