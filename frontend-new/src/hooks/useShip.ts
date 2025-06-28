import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract, usePublicClient } from 'wagmi'
import { parseEther, Address, erc20Abi } from 'viem'
import { toast } from 'react-hot-toast'
import { SHIP_ABI } from '@/lib/contracts'
import { startTransactionMonitoring } from '@/lib/transaction-monitor'

export interface ShipStatus {
  currentPassengers: number
  capacity: number
  collectedFees: bigint
  isLaunched: boolean
  ccipMessageId: string
  ccipFee: bigint
  tokenCount: bigint
}

export function useShip(shipAddress: Address | undefined) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [isBoarding, setIsBoarding] = useState(false)
  const [isLaunching, setIsLaunching] = useState(false)
  
  const { writeContractAsync } = useWriteContract()

  // Read ship status
  const { data: shipStatus, refetch: refetchStatus } = useReadContract({
    address: shipAddress,
    abi: SHIP_ABI,
    functionName: 'getShipStatus',
    query: {
      enabled: !!shipAddress,
    },
  })

  // Read supported tokens
  const { data: supportedTokens } = useReadContract({
    address: shipAddress,
    abi: SHIP_ABI,
    functionName: 'getSupportedTokens',
    query: {
      enabled: !!shipAddress,
    },
  })

  // Read CCIP fee
  const { data: ccipFee } = useReadContract({
    address: shipAddress,
    abi: SHIP_ABI,
    functionName: 'getCcipFee',
    query: {
      enabled: !!shipAddress,
    },
  })

  const boardShip = async (tokens: string[], amounts: string[]) => {
    if (!address || !shipAddress) {
      toast.error('Please connect your wallet')
      return null
    }

    setIsBoarding(true)
    try {
      // Convert amounts to wei
      const amountsInWei = amounts.map(amount => parseEther(amount))
      
      // Check and handle token approvals for each token
      toast.loading('Checking token approvals...')
      for (let i = 0; i < tokens.length; i++) {
        const tokenAddress = tokens[i] as `0x${string}`
        const amount = amountsInWei[i]
        
        // Check current allowance
        const allowanceData = await publicClient?.readContract({
          address: tokenAddress,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [address, shipAddress],
        })
        
        const allowance = allowanceData || BigInt(0)
        
        // If allowance is insufficient, request approval
        if (allowance < amount) {
          toast.dismiss()
          toast.loading(`Approving ${tokens[i]} for ship boarding...`)
          
          try {
            const approvalHash = await writeContractAsync({
              address: tokenAddress,
              abi: erc20Abi,
              functionName: 'approve',
              args: [shipAddress, amount],
            })
            
            // Wait for approval transaction to be mined
            if (publicClient) {
              await publicClient.waitForTransactionReceipt({ hash: approvalHash })
            }
            
            toast.dismiss()
            toast.success(`Token ${i + 1} approved for boarding!`)
          } catch (approvalError) {
            toast.dismiss()
            throw new Error(`Failed to approve token ${i + 1}: ${approvalError instanceof Error ? approvalError.message : 'Unknown error'}`)
          }
        }
      }
      
      toast.dismiss()
      toast.loading('Boarding ship...')
      
      // Base fee for boarding
      const boardingFee = parseEther('0.001') // BASE_FEE from contract

      console.log('Boarding ship with:', {
        tokens,
        amounts: amountsInWei,
        fee: boardingFee
      })

      const hash = await writeContractAsync({
        address: shipAddress,
        abi: SHIP_ABI,
        functionName: 'boardShip',
        args: [tokens as `0x${string}`[], amountsInWei],
        value: boardingFee,
      })

      // Log transaction to dashboard
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).addTransaction) {
        const addFn = (window as unknown as Record<string, unknown>).addTransaction as (
          transaction: Record<string, unknown>
        ) => void
        addFn({
          id: `ship_boarding_${hash}_${Date.now()}`,
          type: 'ship_boarding',
          hash,
          timestamp: Date.now(),
          status: 'pending',
          amount: '0.001',
          token: 'ETH',
          shipAddress: shipAddress,
          description: `Boarded ship with ${tokens.length} tokens`,
          metadata: {
            tokens,
            amounts,
            shipAddress
          }
        })
      }

      // Start monitoring transaction
      if (publicClient) {
        startTransactionMonitoring(publicClient, hash)
      }

      toast.dismiss()
      toast.success('Successfully boarded the ship!')
      await refetchStatus()
      return hash
    } catch (error: unknown) {
      console.error('Error boarding ship:', error)
      toast.dismiss()
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // More specific error messages
      if (errorMessage.includes('ShipFull')) {
        toast.error('Ship is full - cannot board more passengers')
      } else if (errorMessage.includes('AlreadyLaunched')) {
        toast.error('Ship has already launched - cannot board')
      } else if (errorMessage.includes('AlreadyPassenger')) {
        toast.error('You are already a passenger on this ship')
      } else if (errorMessage.includes('InsufficientFee')) {
        toast.error('Insufficient boarding fee. Please check the required amount.')
      } else if (errorMessage.includes('TokenTransferFailed')) {
        toast.error('Token transfer failed. Please check your token balance and approvals.')
      } else if (errorMessage.includes('approve')) {
        toast.error('Token approval failed. Please try again.')
      } else if (errorMessage.includes('rejected')) {
        toast.error('Transaction rejected by user')
      } else {
        toast.error(errorMessage || 'Failed to board ship')
      }
      return null
    } finally {
      setIsBoarding(false)
    }
  }

  const launchShip = async () => {
    if (!address || !shipAddress) {
      toast.error('Please connect your wallet')
      return null
    }

    setIsLaunching(true)
    try {
      console.log('Launching ship...')

      const hash = await writeContractAsync({
        address: shipAddress,
        abi: SHIP_ABI,
        functionName: 'launchShip',
      })

      // Log transaction to dashboard
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).addTransaction) {
        const addFn = (window as unknown as Record<string, unknown>).addTransaction as (
          transaction: Record<string, unknown>
        ) => void
        addFn({
          id: `ship_launch_${hash}_${Date.now()}`,
          type: 'ship_launch',
          hash,
          timestamp: Date.now(),
          status: 'pending',
          shipAddress: shipAddress,
          description: `Launched ship to destination chain`,
          metadata: {
            shipAddress
          }
        })
      }

      // Start monitoring transaction
      if (publicClient) {
        startTransactionMonitoring(publicClient, hash)
      }

      toast.success('Ship launched successfully!')
      await refetchStatus()
      return hash
    } catch (error: unknown) {
      console.error('Error launching ship:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to launch ship')
      return null
    } finally {
      setIsLaunching(false)
    }
  }

  // Parse ship status for easier use
  const parsedStatus: ShipStatus | null = shipStatus ? {
    currentPassengers: Number(shipStatus[0]),
    capacity: Number(shipStatus[1]),
    collectedFees: shipStatus[2],
    isLaunched: shipStatus[3],
    ccipMessageId: shipStatus[4],
    ccipFee: shipStatus[5],
    tokenCount: shipStatus[6],
  } : null

  return {
    boardShip,
    launchShip,
    isBoarding,
    isLaunching,
    shipStatus: parsedStatus,
    supportedTokens,
    ccipFee,
    refetchStatus,
  }
}

// Hook for checking if ship is ready to launch
export function useShipReadyToLaunch(shipAddress?: `0x${string}`) {
  const { shipStatus, ccipFee } = useShip(shipAddress)

  const isReadyToLaunch = shipStatus && ccipFee
    ? shipStatus.currentPassengers === shipStatus.capacity &&
      !shipStatus.isLaunched &&
      shipStatus.collectedFees >= ccipFee
    : false

  return { isReadyToLaunch, shipStatus, ccipFee }
} 