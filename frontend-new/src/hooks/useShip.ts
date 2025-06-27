import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatEther } from 'viem'
import { SHIP_ABI, SUPPORTED_TOKENS, CONTRACTS } from '@/lib/contracts'

export function useShip(shipAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Get ship status
  const { data: shipStatus, refetch: refetchStatus } = useReadContract({
    address: shipAddress,
    abi: SHIP_ABI,
    functionName: 'getShipStatus',
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!shipAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  })

  // Get CCIP fee
  const { data: ccipFee } = useReadContract({
    address: shipAddress,
    abi: SHIP_ABI,
    functionName: 'getCcipFee',
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!shipAddress,
    }
  })

  // Get supported tokens
  const { data: supportedTokens } = useReadContract({
    address: shipAddress,
    abi: SHIP_ABI,
    functionName: 'getSupportedTokens',
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!shipAddress,
    }
  })

  // Board ship function
  const boardShip = async (
    tokens: string[],
    amounts: string[],
    tokenDecimals: number[]
  ) => {
    if (!shipAddress) {
      throw new Error('Ship address is required')
    }

    try {
      // Convert amounts to wei with proper decimals
      const amountsInWei = amounts.map((amount, index) => 
        parseUnits(amount, tokenDecimals[index])
      )

      // Get token addresses from our supported tokens
      const tokenAddresses = tokens.map(symbol => {
        const tokenInfo = SUPPORTED_TOKENS[CONTRACTS.SHIP_FACTORY.chainId]?.[symbol as keyof typeof SUPPORTED_TOKENS[421614]]
        if (!tokenInfo) {
          throw new Error(`Token ${symbol} not supported on this chain`)
        }
        return tokenInfo.address
      })

      // Calculate boarding fee (BASE_FEE + TOKEN_FEE for new tokens)
      const baseFee = parseUnits('0.001', 18) // 0.001 ETH base fee
      const tokenFee = parseUnits('0.0005', 18) // 0.0005 ETH per token

      // For simplicity, assume all tokens might need fee (can be optimized)
      const totalFee = baseFee + (tokenFee * BigInt(tokens.length))

      // Call contract
      writeContract({
        address: shipAddress,
        abi: SHIP_ABI,
        functionName: 'boardShip',
        args: [tokenAddresses, amountsInWei],
        value: totalFee,
        chainId: CONTRACTS.SHIP_FACTORY.chainId,
      })

      return { success: true, hash }
    } catch (error) {
      console.error('Error boarding ship:', error)
      return { success: false, error: error as Error }
    }
  }

  // Launch ship function
  const launchShip = async () => {
    if (!shipAddress) {
      throw new Error('Ship address is required')
    }

    try {
      writeContract({
        address: shipAddress,
        abi: SHIP_ABI,
        functionName: 'launchShip',
        chainId: CONTRACTS.SHIP_FACTORY.chainId,
      })

      return { success: true, hash }
    } catch (error) {
      console.error('Error launching ship:', error)
      return { success: false, error: error as Error }
    }
  }

  // Parse ship status for easier consumption
  const parsedStatus = shipStatus ? {
    currentPassengers: Number(shipStatus[0]),
    capacity: Number(shipStatus[1]),
    collectedFees: shipStatus[2],
    isLaunched: shipStatus[3],
    ccipMessageId: shipStatus[4],
    ccipFee: shipStatus[5],
    tokenCount: Number(shipStatus[6])
  } : null

  return {
    // Actions
    boardShip,
    launchShip,
    refetchStatus,
    
    // Status
    shipStatus: parsedStatus,
    ccipFee,
    supportedTokens: supportedTokens as readonly `0x${string}`[] | undefined,
    
    // Transaction state
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
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