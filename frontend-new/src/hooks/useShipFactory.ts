import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract, useChainId, usePublicClient } from 'wagmi'
import { parseEther, formatEther, erc20Abi } from 'viem'
import { toast } from 'react-hot-toast'
import { CONTRACTS, SHIP_FACTORY_ABI } from '@/lib/contracts'
import { CCIP_CHAIN_SELECTORS } from '@/lib/wagmi'
import { startTransactionMonitoring } from '@/lib/transaction-monitor'

export interface CreateShipParams {
  tokens: string[]
  amounts: string[]
  destinationChainId: number
  capacity: number
}

export function useShipFactory() {
  const { address } = useAccount()
  const chainId = useChainId()
  const publicClient = usePublicClient()
  const [isCreating, setIsCreating] = useState(false)
  
  const { writeContractAsync } = useWriteContract()

  // Read creation fee with dynamic parameters
  const { data: creationFee, refetch: refetchFee } = useReadContract({
    address: CONTRACTS.SHIP_FACTORY.address,
    abi: SHIP_FACTORY_ABI,
    functionName: 'calculateCreationFee',
    args: [5, BigInt(1)], // Default: 5 capacity, 1 token
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
  })

  // Read total ships
  const { data: totalShips } = useReadContract({
    address: CONTRACTS.SHIP_FACTORY.address,
    abi: SHIP_FACTORY_ABI,
    functionName: 'getTotalShips',
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
  })

  // Read user ships
  const { data: userShips } = useReadContract({
    address: CONTRACTS.SHIP_FACTORY.address,
    abi: SHIP_FACTORY_ABI,
    functionName: 'getUserShips',
    args: address ? [address] : undefined,
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
  })

  // Function to calculate fee for specific parameters
  const calculateFeeForParams = async (capacity = 5, tokenCount = 1) => {
    try {
      const { data: fee } = await refetchFee()
      return fee || parseEther('0.002') // Fallback based on contract default
    } catch (error) {
      console.error('Error calculating fee:', error)
      return parseEther('0.002') // Safe fallback
    }
  }

  const createShip = async (params: CreateShipParams) => {
    if (!address) {
      toast.error('Please connect your wallet')
      return null
    }

    if (chainId !== CONTRACTS.SHIP_FACTORY.chainId) {
      toast.error('Please switch to Arbitrum Sepolia')
      return null
    }

    setIsCreating(true)
    
    try {
      console.log('🚀 Starting ship creation with params:', params)
      
      // Validate inputs
      if (!params.amounts.every(amount => parseFloat(amount) > 0)) {
        throw new Error('All amounts must be greater than 0')
      }

      if (params.tokens.length !== params.amounts.length) {
        throw new Error('Tokens and amounts arrays must have the same length')
      }

      // Convert amounts to wei
      const amountsInWei = params.amounts.map(amount => {
        const parsed = parseFloat(amount)
        if (parsed <= 0 || parsed > 100) { // Reasonable limits
          throw new Error(`Invalid amount: ${amount}`)
        }
        return parseEther(amount)
      })
      
      console.log('💰 Amounts in wei:', amountsInWei)
      
      // Get destination chain selector
      const destinationChainSelector = CCIP_CHAIN_SELECTORS[params.destinationChainId as keyof typeof CCIP_CHAIN_SELECTORS]
      
      if (!destinationChainSelector) {
        throw new Error(`Unsupported destination chain: ${params.destinationChainId}`)
      }

      console.log('🌍 Destination chain selector:', destinationChainSelector)

      // Calculate creation fee with actual parameters
      const creationFeeValue = await calculateFeeForParams(params.capacity, params.tokens.length)
      const feeInEth = parseFloat(formatEther(creationFeeValue))
      
      console.log('💸 Creation fee:', feeInEth, 'ETH')
      
      // Safety check for fee
      if (feeInEth > 0.1) { // If fee is more than 0.1 ETH, something is wrong
        throw new Error(`Creation fee too high: ${feeInEth} ETH. Please check contract configuration.`)
      }

      // Validate contract addresses
      if (!CONTRACTS.SHIP_FACTORY.address || !CONTRACTS.SHIP_RECEIVER.address) {
        throw new Error('Contract addresses not configured')
      }

      // Check and handle token approvals for each token
      toast.loading('Checking token approvals...')
      
      for (let i = 0; i < params.tokens.length; i++) {
        const tokenAddress = params.tokens[i] as `0x${string}`
        const amount = amountsInWei[i]
        
        console.log(`🔍 Checking approval for token ${i + 1}:`, tokenAddress)
        
        try {
          // Check current allowance
          const allowanceData = await publicClient?.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'allowance',
            args: [address, CONTRACTS.SHIP_FACTORY.address],
          })
          
          const allowance = allowanceData || BigInt(0)
          console.log(`📋 Current allowance for token ${i + 1}:`, formatEther(allowance))
          
          // If allowance is insufficient, request approval
          if (allowance < amount) {
            toast.dismiss()
            toast.loading(`Approving token ${i + 1} for spending...`)
            
            console.log(`✅ Requesting approval for token ${i + 1}...`)
            
            const approvalHash = await writeContractAsync({
              address: tokenAddress,
              abi: erc20Abi,
              functionName: 'approve',
              args: [CONTRACTS.SHIP_FACTORY.address, amount],
            })
            
            console.log(`📝 Approval transaction hash for token ${i + 1}:`, approvalHash)
            
            // Wait for approval transaction to be mined
            if (publicClient) {
              await publicClient.waitForTransactionReceipt({ hash: approvalHash })
            }
            
            toast.dismiss()
            toast.success(`Token ${i + 1} approved successfully!`)
          } else {
            console.log(`✅ Token ${i + 1} already has sufficient allowance`)
          }
        } catch (approvalError) {
          console.error(`❌ Approval failed for token ${i + 1}:`, approvalError)
          toast.dismiss()
          throw new Error(`Failed to approve token ${i + 1}: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`)
        }
      }
      
      toast.dismiss()
      toast.loading('Creating ship...')

      console.log('🔧 Creating ship with final params:', {
        tokens: params.tokens,
        amounts: amountsInWei.map(a => formatEther(a)),
        destinationChainSelector,
        capacity: params.capacity,
        destinationReceiver: CONTRACTS.SHIP_RECEIVER.address,
        fee: feeInEth
      })

      // Create the ship
      const hash = await writeContractAsync({
        address: CONTRACTS.SHIP_FACTORY.address,
        abi: SHIP_FACTORY_ABI,
        functionName: 'createShip',
        args: [
          params.tokens as readonly `0x${string}`[],
          amountsInWei,
          BigInt(destinationChainSelector),
          params.capacity,
          CONTRACTS.SHIP_RECEIVER.address
        ],
        value: creationFeeValue,
        gas: BigInt(800000), // Increased gas limit for safety
      })

      console.log('🎉 Ship creation transaction hash:', hash)

      // Log transaction to dashboard
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).addTransaction) {
        const addFn = (window as unknown as Record<string, unknown>).addTransaction as (
          transaction: Record<string, unknown>
        ) => void
        addFn({
          id: `ship_creation_${hash}_${Date.now()}`,
          type: 'ship_creation',
          hash,
          timestamp: Date.now(),
          status: 'pending',
          amount: feeInEth.toString(),
          token: 'ETH',
          description: `Created ship with ${params.tokens.length} tokens and ${params.capacity} capacity`,
          metadata: {
            tokens: params.tokens,
            amounts: params.amounts,
            capacity: params.capacity,
            destinationChain: params.destinationChainId
          }
        })
      }

      // Start monitoring transaction
      if (publicClient) {
        startTransactionMonitoring(publicClient, hash, {
          onSuccess: () => {
            if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).updateTransactionStatus) {
              const updateFn = (window as unknown as Record<string, unknown>).updateTransactionStatus as (
                hash: string, status: string, metadata?: Record<string, unknown>
              ) => void
              updateFn(hash, 'confirmed', { blockNumber: Date.now() })
            }
          },
          onError: (error) => {
            console.error('Transaction failed:', error)
            if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).updateTransactionStatus) {
              const updateFn = (window as unknown as Record<string, unknown>).updateTransactionStatus as (
                hash: string, status: string, metadata?: Record<string, unknown>
              ) => void
              updateFn(hash, 'failed', { error: error instanceof Error ? error.message : 'Unknown error' })
            }
          }
        })
      }

      toast.dismiss()
      toast.success('🚀 Ship created successfully! Check your wallet for confirmation.')
      return hash
      
    } catch (error) {
      console.error('❌ Error creating ship:', error)
      toast.dismiss()
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // More specific error messages based on common failure patterns
      if (errorMessage.includes('insufficient funds')) {
        toast.error('💸 Insufficient funds for transaction (need ETH for gas + creation fee)')
      } else if (errorMessage.includes('InsufficientFee')) {
        toast.error('💰 Insufficient fee for ship creation. Please try again.')
      } else if (errorMessage.includes('TokenTransferFailed') || errorMessage.includes('transfer')) {
        toast.error('🔄 Token transfer failed. Check your token balance and try again.')
      } else if (errorMessage.includes('gas')) {
        toast.error('⛽ Gas estimation failed. Try increasing gas limit or check network.')
      } else if (errorMessage.includes('rejected') || errorMessage.includes('denied')) {
        toast.error('❌ Transaction rejected by user')
      } else if (errorMessage.includes('approve') || errorMessage.includes('allowance')) {
        toast.error('📝 Token approval failed. Please try again.')
      } else if (errorMessage.includes('network') || errorMessage.includes('chain')) {
        toast.error('🌐 Network error. Please check your connection and try again.')
      } else if (errorMessage.includes('nonce')) {
        toast.error('🔄 Transaction nonce error. Please reset your wallet and try again.')
      } else {
        toast.error(`❌ ${errorMessage}`)
      }
      return null
    } finally {
      setIsCreating(false)
    }
  }

  return {
    createShip,
    isCreating,
    creationFee,
    totalShips,
    userShips,
    refetchFee,
    calculateFeeForParams,
  }
}

// Hook to read user's ships
export function useUserShips(address?: `0x${string}`) {
  const { data: shipIds } = useReadContract({
    address: CONTRACTS.SHIP_FACTORY.address as `0x${string}`,
    abi: SHIP_FACTORY_ABI,
    functionName: 'getUserShips',
    args: address ? [address] : undefined,
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!address,
    }
  })

  return { shipIds: shipIds as readonly bigint[] | undefined }
}

// Hook to get ship address by ID
export function useShipAddress(shipId?: bigint) {
  const { data: shipAddress } = useReadContract({
    address: CONTRACTS.SHIP_FACTORY.address as `0x${string}`,
    abi: SHIP_FACTORY_ABI,
    functionName: 'getShip',
    args: shipId ? [shipId] : undefined,
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!shipId,
    }
  })

  return { shipAddress: shipAddress as `0x${string}` | undefined }
} 