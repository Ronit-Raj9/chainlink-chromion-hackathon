import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, formatUnits } from 'viem'
import { ERC20_ABI, CONTRACTS, SUPPORTED_TOKENS } from '@/lib/contracts'

export function useToken(tokenAddress?: `0x${string}`, userAddress?: `0x${string}`) {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Get token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!(tokenAddress && userAddress),
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  })

  // Get allowance for ShipFactory
  const { data: factoryAllowance, refetch: refetchFactoryAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: userAddress ? [userAddress, CONTRACTS.SHIP_FACTORY.address as `0x${string}`] : undefined,
    chainId: CONTRACTS.SHIP_FACTORY.chainId,
    query: {
      enabled: !!(tokenAddress && userAddress),
    }
  })

  // Get allowance for a specific ship
  const getAllowanceForShip = (shipAddress: `0x${string}`) => {
    const { data: shipAllowance, refetch: refetchShipAllowance } = useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'allowance',
      args: userAddress ? [userAddress, shipAddress] : undefined,
      chainId: CONTRACTS.SHIP_FACTORY.chainId,
      query: {
        enabled: !!(tokenAddress && userAddress && shipAddress),
      }
    })

    return { shipAllowance, refetchShipAllowance }
  }

  // Approve tokens for ShipFactory
  const approveFactory = async (amount: string, decimals: number) => {
    if (!tokenAddress) {
      throw new Error('Token address is required')
    }

    try {
      const amountInWei = parseUnits(amount, decimals)
      
      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACTS.SHIP_FACTORY.address as `0x${string}`, amountInWei],
        chainId: CONTRACTS.SHIP_FACTORY.chainId,
      })

      return { success: true, hash }
    } catch (error) {
      console.error('Error approving factory:', error)
      return { success: false, error: error as Error }
    }
  }

  // Approve tokens for a specific ship
  const approveShip = async (shipAddress: `0x${string}`, amount: string, decimals: number) => {
    if (!tokenAddress) {
      throw new Error('Token address is required')
    }

    try {
      const amountInWei = parseUnits(amount, decimals)
      
      writeContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [shipAddress, amountInWei],
        chainId: CONTRACTS.SHIP_FACTORY.chainId,
      })

      return { success: true, hash }
    } catch (error) {
      console.error('Error approving ship:', error)
      return { success: false, error: error as Error }
    }
  }

  return {
    // Data
    balance,
    factoryAllowance,
    getAllowanceForShip,
    
    // Actions
    approveFactory,
    approveShip,
    refetchBalance,
    refetchFactoryAllowance,
    
    // Transaction state
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  }
}

// Hook to get token info from supported tokens
export function useTokenInfo(tokenSymbol?: string) {
  const chainId = CONTRACTS.SHIP_FACTORY.chainId
  const tokenInfo = tokenSymbol 
    ? SUPPORTED_TOKENS[chainId]?.[tokenSymbol as keyof typeof SUPPORTED_TOKENS[421614]]
    : undefined

  return {
    tokenAddress: tokenInfo?.address as `0x${string}` | undefined,
    decimals: tokenInfo?.decimals,
    symbol: tokenInfo?.symbol,
  }
}

// Hook to get multiple token balances
export function useTokenBalances(tokenSymbols: string[], userAddress?: `0x${string}`) {
  const chainId = CONTRACTS.SHIP_FACTORY.chainId
  
  const balances = tokenSymbols.map(symbol => {
    const tokenInfo = SUPPORTED_TOKENS[chainId]?.[symbol as keyof typeof SUPPORTED_TOKENS[421614]]
    const tokenAddress = tokenInfo?.address as `0x${string}` | undefined
    
    const { data: balance } = useReadContract({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: userAddress ? [userAddress] : undefined,
      chainId: chainId,
      query: {
        enabled: !!(tokenAddress && userAddress),
        refetchInterval: 10000,
      }
    })

    return {
      symbol,
      address: tokenAddress,
      balance: balance as bigint | undefined,
      decimals: tokenInfo?.decimals,
      formatted: balance && tokenInfo ? formatUnits(balance, tokenInfo.decimals) : '0'
    }
  })

  return { balances }
}

// Helper to check if user has sufficient balance and allowance
export function useTokenValidation(
  tokenSymbol: string,
  amount: string,
  userAddress?: `0x${string}`,
  spenderAddress?: `0x${string}`
) {
  const { tokenAddress, decimals } = useTokenInfo(tokenSymbol)
  const { balance, getAllowanceForShip } = useToken(tokenAddress, userAddress)
  
  const { shipAllowance } = spenderAddress ? getAllowanceForShip(spenderAddress) : { shipAllowance: undefined }

  const validation = {
    hasAddress: !!tokenAddress,
    hasSufficientBalance: false,
    hasSufficientAllowance: false,
    needsApproval: false,
  }

  if (balance && decimals && amount) {
    try {
      const amountInWei = parseUnits(amount, decimals)
      validation.hasSufficientBalance = balance >= amountInWei
      
      if (shipAllowance !== undefined) {
        validation.hasSufficientAllowance = shipAllowance >= amountInWei
        validation.needsApproval = !validation.hasSufficientAllowance
      }
    } catch (error) {
      console.error('Error validating token:', error)
    }
  }

  return validation
} 