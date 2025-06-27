import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatEther } from 'viem'
import { CONTRACTS, SHIP_FACTORY_ABI, CCIP_CHAIN_SELECTORS, SUPPORTED_TOKENS } from '@/lib/contracts'

export function useShipFactory() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Calculate creation fee
  const calculateCreationFee = async (capacity: number, tokenCount: number) => {
    try {
      const result = await useReadContract({
        address: CONTRACTS.SHIP_FACTORY.address as `0x${string}`,
        abi: SHIP_FACTORY_ABI,
        functionName: 'calculateCreationFee',
        args: [capacity, BigInt(tokenCount)],
        chainId: CONTRACTS.SHIP_FACTORY.chainId,
      })
      return result
    } catch (error) {
      console.error('Error calculating creation fee:', error)
      return BigInt(0)
    }
  }

  // Create a new ship
  const createShip = async (
    tokens: string[],
    amounts: string[], 
    tokenDecimals: number[],
    capacity: number = 10
  ) => {
    try {
      // Convert amounts to wei with proper decimals
      const amountsInWei = amounts.map((amount, index) => 
        parseUnits(amount, tokenDecimals[index])
      )

      // Get destination chain selector (always Ethereum Sepolia for now)
      const destinationChainSelector = CCIP_CHAIN_SELECTORS.ETHEREUM_SEPOLIA

      // Get token addresses from our supported tokens
      const tokenAddresses = tokens.map(symbol => {
        const tokenInfo = SUPPORTED_TOKENS[CONTRACTS.SHIP_FACTORY.chainId]?.[symbol as keyof typeof SUPPORTED_TOKENS[421614]]
        if (!tokenInfo) {
          throw new Error(`Token ${symbol} not supported on this chain`)
        }
        return tokenInfo.address
      })

      // Calculate fee
      const fee = await calculateCreationFee(capacity, tokens.length)
      
      // Call contract
      writeContract({
        address: CONTRACTS.SHIP_FACTORY.address as `0x${string}`,
        abi: SHIP_FACTORY_ABI,
        functionName: 'createShip',
        args: [
          tokenAddresses,
          amountsInWei,
          BigInt(destinationChainSelector),
          capacity,
          CONTRACTS.SHIP_RECEIVER.address as `0x${string}`
        ],
        value: fee as bigint,
        chainId: CONTRACTS.SHIP_FACTORY.chainId,
      })

      return { success: true, hash }
    } catch (error) {
      console.error('Error creating ship:', error)
      return { success: false, error: error as Error }
    }
  }

  return {
    createShip,
    calculateCreationFee,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
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