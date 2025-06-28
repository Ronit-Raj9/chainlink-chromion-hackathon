import { type PublicClient } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { toast } from 'react-hot-toast'

export interface TransactionMonitor {
  hash: string
  onSuccess?: (receipt: unknown) => void
  onError?: (error: unknown) => void
  timeout?: number
}

export async function monitorTransaction(
  publicClient: PublicClient,
  { hash, onSuccess, onError, timeout = 60000 }: TransactionMonitor
) {
  try {
    console.log(`Monitoring transaction: ${hash}`)
    
    const receipt = await waitForTransactionReceipt(publicClient, {
      hash: hash as `0x${string}`,
      timeout
    })

    console.log('Transaction confirmed:', receipt)

    // Update transaction status in dashboard
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).updateTransactionStatus) {
      const updateFn = (window as unknown as Record<string, unknown>).updateTransactionStatus as (
        hash: string,
        status: string,
        metadata: Record<string, unknown>
      ) => void
      updateFn(hash, 'confirmed', {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed?.toString(),
        transactionIndex: receipt.transactionIndex
      })
    }

    // Call success callback
    if (onSuccess) {
      onSuccess(receipt)
    }

    toast.success('Transaction confirmed!')
    return receipt

  } catch (error: unknown) {
    console.error('Transaction failed:', error)

    // Update transaction status in dashboard
    if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).updateTransactionStatus) {
      const updateFn = (window as unknown as Record<string, unknown>).updateTransactionStatus as (
        hash: string,
        status: string,
        metadata: Record<string, unknown>
      ) => void
      updateFn(hash, 'failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }

    // Call error callback
    if (onError) {
      onError(error)
    }

    toast.error('Transaction failed!')
    throw error
  }
}

// Helper to start monitoring a transaction hash
export function startTransactionMonitoring(
  publicClient: PublicClient,
  hash: string,
  options?: Partial<TransactionMonitor>
) {
  if (!hash) return

  monitorTransaction(publicClient, {
    hash,
    ...options
  }).catch(console.error)
}

// Global function to add transaction and start monitoring
export function addTransactionWithMonitoring(
  publicClient: PublicClient,
  transaction: Record<string, unknown>,
  options?: Partial<TransactionMonitor>
) {
  // Add transaction to dashboard
  if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).addTransaction) {
    const addFn = (window as unknown as Record<string, unknown>).addTransaction as (
      transaction: Record<string, unknown>
    ) => void
    addFn(transaction)
  }

  // Start monitoring if hash is provided
  if (transaction.hash && typeof transaction.hash === 'string') {
    startTransactionMonitoring(publicClient, transaction.hash, options)
  }
} 