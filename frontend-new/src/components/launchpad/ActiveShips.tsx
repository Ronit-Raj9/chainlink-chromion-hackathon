"use client"

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { motion } from 'framer-motion'
import { Users, Rocket, Clock, ArrowRight } from 'lucide-react'

import { useUserShips } from '@/hooks/useShipFactory'
import { CONTRACTS, SHIP_FACTORY_ABI } from '@/lib/contracts'

interface ShipInfo {
  id: bigint
  address: string
  currentPassengers: number
  capacity: number
  isLaunched: boolean
  ccipFee: bigint
  collectedFees: bigint
}

export default function ActiveShips() {
  const { address } = useAccount()
  const [ships, setShips] = useState<ShipInfo[]>([])
  
  // Get total ships count
  const { data: totalShips } = useReadContract({
    address: CONTRACTS.SHIP_FACTORY.address,
    abi: SHIP_FACTORY_ABI,
    functionName: 'getTotalShips',
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
  })

  // Get user's ships
  const { shipIds } = useUserShips(address)

  // Load ship details
  useEffect(() => {
    if (!totalShips) return

    const loadShips = async () => {
      const shipPromises = []
      const shipCount = Number(totalShips)
      
      // Load last 10 ships or all ships if less than 10
      const startId = Math.max(0, shipCount - 10)
      
      for (let i = startId; i < shipCount; i++) {
        shipPromises.push(loadShipInfo(BigInt(i)))
      }
      
      const shipInfos = await Promise.all(shipPromises)
      setShips(shipInfos.filter((ship): ship is ShipInfo => ship !== null && !ship.isLaunched))
    }

    loadShips()
  }, [totalShips])

  const loadShipInfo = async (shipId: bigint): Promise<ShipInfo | null> => {
    try {
      // This would need to be implemented with proper contract calls
      // For now, return mock data
      return {
        id: shipId,
        address: `0x${shipId.toString(16).padStart(40, '0')}`,
        currentPassengers: Math.floor(Math.random() * 5) + 1,
        capacity: 5,
        isLaunched: false,
        ccipFee: BigInt('1000000000000000'), // 0.001 ETH
        collectedFees: BigInt('5000000000000000'), // 0.005 ETH
      }
    } catch (error) {
      console.error('Error loading ship info:', error)
      return null
    }
  }

  const ShipCard = ({ ship }: { ship: ShipInfo }) => {
    const progressPercent = (ship.currentPassengers / ship.capacity) * 100
    const isUserShip = shipIds?.includes(ship.id)
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/80 backdrop-blur-sm rounded-xl border border-cyan-500/30 p-6 hover:border-cyan-400/50 transition-all duration-300"
      >
        {/* Ship Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">Ship #{ship.id.toString()}</h3>
              <p className="text-gray-400 text-sm">
                {ship.address.slice(0, 8)}...{ship.address.slice(-6)}
              </p>
            </div>
          </div>
          {isUserShip && (
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
              Your Ship
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-300 text-sm flex items-center gap-1">
              <Users className="w-4 h-4" />
              Passengers
            </span>
            <span className="text-white font-mono">
              {ship.currentPassengers}/{ship.capacity}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Ship Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-gray-400 text-xs">Shared Fee</div>
            <div className="text-white font-mono text-sm">
              {formatEther(ship.ccipFee / BigInt(ship.capacity))} ETH
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-400 text-xs">Collected</div>
            <div className="text-white font-mono text-sm">
              {formatEther(ship.collectedFees)} ETH
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
            ship.currentPassengers >= ship.capacity
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : isUserShip
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30'
          }`}
          disabled={ship.currentPassengers >= ship.capacity || isUserShip}
        >
          {ship.currentPassengers >= ship.capacity ? (
            <>
              <Rocket className="w-4 h-4" />
              Ready to Launch
            </>
          ) : isUserShip ? (
            <>
              <Clock className="w-4 h-4" />
              Waiting for Passengers
            </>
          ) : (
            <>
              <ArrowRight className="w-4 h-4" />
              Board Ship
            </>
          )}
        </button>
      </motion.div>
    )
  }

  if (!ships.length) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Rocket className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-white font-bold mb-2">No Active Ships</h3>
        <p className="text-gray-400">Create the first ship to start your journey!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Active Ships</h2>
        <p className="text-gray-400">Join an existing ship or wait for yours to fill up</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ships.map((ship) => (
          <ShipCard key={ship.id.toString()} ship={ship} />
        ))}
      </div>
    </div>
  )
} 