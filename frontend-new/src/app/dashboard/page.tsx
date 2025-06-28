'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { 
  RocketLaunchIcon, 
  CurrencyDollarIcon, 
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { addDemoTransactions } from '@/lib/demo-transactions'

// Transaction types
export interface Transaction {
  id: string
  type: 'ship_creation' | 'ship_boarding' | 'ship_launch' | 'token_approval'
  hash: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  amount?: string
  token?: string
  shipId?: string
  shipAddress?: string
  fromChain?: number
  toChain?: number
  ccipMessageId?: string
  gasUsed?: string
  gasPrice?: string
  blockNumber?: number
  description: string
  metadata?: Record<string, unknown>
}

// Statistics interface
interface DashboardStats {
  totalTransactions: number
  successfulTransactions: number
  totalValueTransferred: string
  shipsCreated: number
  shipsBoarded: number
  shipsLaunched: number
}

// Local storage keys
const TRANSACTIONS_STORAGE_KEY = 'starbridge_transactions'
const STATS_STORAGE_KEY = 'starbridge_stats'

export default function Dashboard() {
  const { address } = useAccount()
  
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalTransactions: 0,
    successfulTransactions: 0,
    totalValueTransferred: '0',
    shipsCreated: 0,
    shipsBoarded: 0,
    shipsLaunched: 0
  })
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'failed'>('all')
  const [sortBy, setSortBy] = useState<'timestamp' | 'amount' | 'type'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Update statistics
  const updateStats = useCallback((txs: Transaction[]) => {
    if (!address) return
    
    const newStats: DashboardStats = {
      totalTransactions: txs.length,
      successfulTransactions: txs.filter(tx => tx.status === 'confirmed').length,
      totalValueTransferred: txs
        .filter(tx => tx.status === 'confirmed' && tx.amount)
        .reduce((sum, tx) => sum + parseFloat(tx.amount || '0'), 0)
        .toFixed(4),
      shipsCreated: txs.filter(tx => tx.type === 'ship_creation' && tx.status === 'confirmed').length,
      shipsBoarded: txs.filter(tx => tx.type === 'ship_boarding' && tx.status === 'confirmed').length,
      shipsLaunched: txs.filter(tx => tx.type === 'ship_launch' && tx.status === 'confirmed').length,
    }
    
    setStats(newStats)
    const key = `${STATS_STORAGE_KEY}_${address.toLowerCase()}`
    localStorage.setItem(key, JSON.stringify(newStats))
  }, [address])

  // Load transactions from local storage
  const loadTransactions = useCallback(() => {
    if (!address) return
    
    const key = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      setTransactions(parsed)
      updateStats(parsed)
    }
  }, [address, updateStats])

  // Load stats from local storage
  const loadStats = useCallback(() => {
    if (!address) return
    
    const key = `${STATS_STORAGE_KEY}_${address.toLowerCase()}`
    const stored = localStorage.getItem(key)
    if (stored) {
      setStats(JSON.parse(stored))
    }
  }, [address])

  // Save transaction to local storage
  const saveTransaction = useCallback((transaction: Transaction) => {
    if (!address) return
    
    const key = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const updated = [transaction, ...existing]
    localStorage.setItem(key, JSON.stringify(updated))
    setTransactions(updated)
    updateStats(updated)
  }, [address, updateStats])

  // Update transaction status
  const updateTransactionStatus = useCallback((txHash: string, status: 'confirmed' | 'failed', metadata?: Record<string, unknown>) => {
    if (!address) return
    
    const key = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const existing = JSON.parse(localStorage.getItem(key) || '[]')
    const updated = existing.map((tx: Transaction) => 
      tx.hash === txHash ? { ...tx, status, ...metadata } : tx
    )
    localStorage.setItem(key, JSON.stringify(updated))
    setTransactions(updated)
    updateStats(updated)
  }, [address, updateStats])

  // Load data from local storage on mount
  useEffect(() => {
    if (address) {
      loadTransactions()
      loadStats()
    }
  }, [address, loadTransactions, loadStats])

  // Clear all transactions
  const clearTransactions = () => {
    if (!address) return
    
    const txKey = `${TRANSACTIONS_STORAGE_KEY}_${address.toLowerCase()}`
    const statsKey = `${STATS_STORAGE_KEY}_${address.toLowerCase()}`
    localStorage.removeItem(txKey)
    localStorage.removeItem(statsKey)
    setTransactions([])
    setStats({
      totalTransactions: 0,
      successfulTransactions: 0,
      totalValueTransferred: '0',
      shipsCreated: 0,
      shipsBoarded: 0,
      shipsLaunched: 0
    })
  }

  // Load demo transactions
  const loadDemoTransactions = useCallback(() => {
    if (!address) return
    
    addDemoTransactions(address)
    loadTransactions()
    loadStats()
  }, [address, loadTransactions, loadStats])

  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(tx => filter === 'all' || tx.status === filter)
    .sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'timestamp':
          aValue = a.timestamp
          bValue = b.timestamp
          break
        case 'amount':
          aValue = parseFloat(a.amount || '0')
          bValue = parseFloat(b.amount || '0')
          break
        case 'type':
          aValue = a.type
          bValue = b.type
          break
        default:
          aValue = a.timestamp
          bValue = b.timestamp
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  // Get transaction icon
  const getTransactionIcon = (type: string, status: string) => {
    const iconClass = `w-6 h-6 ${
      status === 'confirmed' ? 'text-green-400' : 
      status === 'failed' ? 'text-red-400' : 
      'text-yellow-400'
    }`
    
    switch (type) {
      case 'ship_creation':
        return <RocketLaunchIcon className={iconClass} />
      case 'ship_boarding':
        return <UserGroupIcon className={iconClass} />
      case 'ship_launch':
        return <StarIcon className={iconClass} />
      case 'token_approval':
        return <CheckCircleIcon className={iconClass} />
      default:
        return <CurrencyDollarIcon className={iconClass} />
    }
  }

  // Get transaction type label
  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'ship_creation':
        return 'Ship Creation'
      case 'ship_boarding':
        return 'Ship Boarding'
      case 'ship_launch':
        return 'Ship Launch'
      case 'token_approval':
        return 'Token Approval'
      default:
        return 'Transaction'
    }
  }

  // Expose functions globally for other components to use
  useEffect(() => {
    if (typeof window !== 'undefined') {
      ;(window as unknown as Record<string, unknown>).addTransaction = saveTransaction
      ;(window as unknown as Record<string, unknown>).updateTransactionStatus = updateTransactionStatus
    }
  }, [saveTransaction, updateTransactionStatus])

  if (!address) {
    return (
      <div className="min-h-screen bg-space-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-orbitron mb-4 text-white">
            Dashboard
          </h1>
          <p className="text-gray-400 mb-8">Please connect your wallet to view your dashboard</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-space-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-orbitron mb-2">
            <span className="bg-hero-gradient bg-clip-text text-transparent">
              Mission Control Dashboard
            </span>
          </h1>
          <p className="text-gray-400">Track your interstellar journey and transaction history</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-white">{stats.totalTransactions}</p>
              </div>
              <CurrencyDollarIcon className="w-8 h-8 text-electric-blue" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Successful</p>
                <p className="text-2xl font-bold text-green-400">{stats.successfulTransactions}</p>
              </div>
              <CheckCircleIcon className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Ships Created</p>
                <p className="text-2xl font-bold text-cosmic-purple">{stats.shipsCreated}</p>
              </div>
              <RocketLaunchIcon className="w-8 h-8 text-cosmic-purple" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Value Transferred</p>
                <p className="text-2xl font-bold text-neon-cyan">{stats.totalValueTransferred} ETH</p>
              </div>
              <ArrowUpIcon className="w-8 h-8 text-neon-cyan" />
            </div>
          </motion.div>
        </div>

        {/* Filters and Controls */}
        <div className="glass-effect rounded-xl p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Filter by Status</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'confirmed' | 'failed')}
                  className="bg-space-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-electric-blue focus:outline-none"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'timestamp' | 'amount' | 'type')}
                  className="bg-space-black border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-electric-blue focus:outline-none"
                >
                  <option value="timestamp">Time</option>
                  <option value="amount">Amount</option>
                  <option value="type">Type</option>
                </select>
              </div>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="mt-6 bg-electric-blue/20 border border-electric-blue/50 rounded-lg px-3 py-2 text-electric-blue hover:bg-electric-blue/30 transition-colors"
              >
                {sortOrder === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={loadDemoTransactions}
                className="bg-cosmic-purple/20 border border-cosmic-purple/50 rounded-lg px-4 py-2 text-cosmic-purple hover:bg-cosmic-purple/30 transition-colors flex items-center gap-2"
              >
                <StarIcon className="w-4 h-4" />
                Load Demo
              </button>
              <button
                onClick={clearTransactions}
                className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-2"
              >
                <TrashIcon className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-2xl font-bold font-orbitron mb-6 text-white">Transaction History</h2>
          
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No transactions found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter !== 'all' ? 'Try changing the filter' : 'Start your interstellar journey!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-space-black/50 border border-gray-700 rounded-lg p-4 hover:border-electric-blue/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedTransaction(tx)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {getTransactionIcon(tx.type, tx.status)}
                      <div>
                        <p className="text-white font-medium">{getTransactionTypeLabel(tx.type)}</p>
                        <p className="text-gray-400 text-sm">{tx.description}</p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {tx.amount && (
                        <p className="text-white font-medium">{tx.amount} {tx.token || 'ETH'}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                          tx.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {tx.status}
                        </span>
                        <button className="text-gray-400 hover:text-white">
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-effect rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Transaction Details</h3>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircleIcon className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm">Type</label>
                  <p className="text-white">{getTransactionTypeLabel(selectedTransaction.type)}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className={`font-medium ${
                    selectedTransaction.status === 'confirmed' ? 'text-green-400' :
                    selectedTransaction.status === 'failed' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    {selectedTransaction.status}
                  </p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Hash</label>
                  <p className="text-white font-mono text-sm break-all">{selectedTransaction.hash}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Description</label>
                  <p className="text-white">{selectedTransaction.description}</p>
                </div>
                
                <div>
                  <label className="text-gray-400 text-sm">Timestamp</label>
                  <p className="text-white">{new Date(selectedTransaction.timestamp).toLocaleString()}</p>
                </div>
                
                {selectedTransaction.amount && (
                  <div>
                    <label className="text-gray-400 text-sm">Amount</label>
                    <p className="text-white">{selectedTransaction.amount} {selectedTransaction.token || 'ETH'}</p>
                  </div>
                )}
                
                {selectedTransaction.shipAddress && (
                  <div>
                    <label className="text-gray-400 text-sm">Ship Address</label>
                    <p className="text-white font-mono text-sm break-all">{selectedTransaction.shipAddress}</p>
                  </div>
                )}
                
                {selectedTransaction.ccipMessageId && (
                  <div>
                    <label className="text-gray-400 text-sm">CCIP Message ID</label>
                    <p className="text-white font-mono text-sm break-all">{selectedTransaction.ccipMessageId}</p>
                  </div>
                )}
                
                {selectedTransaction.gasUsed && (
                  <div>
                    <label className="text-gray-400 text-sm">Gas Used</label>
                    <p className="text-white">{selectedTransaction.gasUsed}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
} 