import { useState } from 'react'
import { useAccount, useWriteContract, useReadContract, usePublicClient } from 'wagmi'
import { parseEther, parseUnits, Address, erc20Abi, maxUint256 } from 'viem'
import { toast } from 'react-hot-toast'
import { ERC20_ABI, CONTRACTS, TEST_TOKENS } from '@/lib/contracts'
import { startTransactionMonitoring } from '@/lib/transaction-monitor'

export function useToken(tokenAddress: Address | undefined) {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [isApproving, setIsApproving] = useState(false)
  
  const { writeContractAsync } = useWriteContract()

  // Read token balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!tokenAddress && !!address,
    },
  })

  // Read token allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, '0x0000000000000000000000000000000000000000'] : undefined,
    query: {
      enabled: !!tokenAddress && !!address,
    },
  })

  // Read token info
  const { data: tokenName } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const { data: tokenDecimals } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: !!tokenAddress,
    },
  })

  const approveToken = async (spender: Address, amount: string) => {
    if (!address || !tokenAddress) {
      toast.error('Please connect your wallet')
      return null
    }

    setIsApproving(true)
    try {
      const amountInWei = parseEther(amount)

      console.log('Approving token:', {
        token: tokenAddress,
        spender,
        amount: amountInWei
      })

      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [spender, amountInWei],
      })

      // Log transaction to dashboard
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).addTransaction) {
        const addFn = (window as unknown as Record<string, unknown>).addTransaction as (
          transaction: Record<string, unknown>
        ) => void
        addFn({
          id: `token_approval_${hash}_${Date.now()}`,
          type: 'token_approval',
          hash,
          timestamp: Date.now(),
          status: 'pending',
          amount: amount,
          token: tokenSymbol || 'Token',
          description: `Approved ${amount} ${tokenSymbol || 'tokens'} for spending`,
          metadata: {
            tokenAddress: tokenAddress,
            spender,
            amount
          }
        })
      }

      // Start monitoring transaction
      if (publicClient) {
        startTransactionMonitoring(publicClient, hash)
      }

      toast.success('Token approved successfully!')
      await refetchAllowance()
      return hash
    } catch (error: unknown) {
      console.error('Error approving token:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to approve token')
      return null
    } finally {
      setIsApproving(false)
    }
  }

  return {
    approveToken,
    isApproving,
    balance,
    allowance,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    refetchBalance,
    refetchAllowance,
  }
}

// Hook to get token info from supported tokens
export function useTokenInfo(tokenSymbol?: string) {
  const chainId = CONTRACTS.SHIP_FACTORY.chainId
  const tokenInfo = tokenSymbol 
    ? TEST_TOKENS[chainId]?.[tokenSymbol as keyof typeof TEST_TOKENS[421614]]
    : undefined

  return {
    tokenAddress: tokenInfo as `0x${string}` | undefined,
    decimals: 18, // Default to 18 decimals for test tokens
    symbol: tokenSymbol,
  }
}

// Hook to get multiple token balances - simplified version
export function useTokenBalances(tokenSymbols: string[]) {
  const chainId = CONTRACTS.SHIP_FACTORY.chainId
  
  // Create a simplified structure without hook calls in callbacks
  const balances = tokenSymbols.map(symbol => {
    const tokenInfo = TEST_TOKENS[chainId]?.[symbol as keyof typeof TEST_TOKENS[421614]]
    
    return {
      symbol,
      address: tokenInfo as `0x${string}` | undefined,
      balance: undefined as bigint | undefined,
      decimals: 18,
      formatted: '0'
    }
  })

  return { balances }
}

// Hook for token approval functionality
export function useTokenApproval(tokenAddress?: `0x${string}`, spenderAddress?: `0x${string}`) {
  const { address } = useAccount()
  const [isApproving, setIsApproving] = useState(false)
  const { writeContractAsync } = useWriteContract()

  // Read current allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && spenderAddress ? [address, spenderAddress] : undefined,
    query: {
      enabled: !!(tokenAddress && address && spenderAddress),
    },
  })

  // Check if user has sufficient allowance for amount
  const hasAllowance = (amount: bigint) => {
    return allowance ? allowance >= amount : false
  }

  // Approve tokens for spending
  const approve = async (amount: bigint) => {
    if (!address || !tokenAddress || !spenderAddress) {
      toast.error('Please connect your wallet')
      return null
    }

    setIsApproving(true)
    try {
      const hash = await writeContractAsync({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spenderAddress, amount],
      })

      toast.success('Token approval successful!')
      await refetchAllowance()
      return hash
    } catch (error: unknown) {
      console.error('Error approving token:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to approve tokens')
      return null
    } finally {
      setIsApproving(false)
    }
  }

  // Approve maximum amount (infinite approval)
  const approveMax = async () => {
    return approve(maxUint256)
  }

  // Reset allowance to zero
  const resetAllowance = async () => {
    return approve(BigInt(0))
  }

  return {
    allowance: allowance || BigInt(0),
    hasAllowance,
    approve,
    approveMax,
    resetAllowance,
    isApproving,
    refetchAllowance,
  }
}

// Helper to check if user needs approval and has sufficient balance
export function useTokenValidationWithApproval(
  tokenAddress?: `0x${string}`,
  spenderAddress?: `0x${string}`,
  amount?: string,
  decimals?: number
) {
  const { balance } = useToken(tokenAddress)
  const { hasAllowance } = useTokenApproval(tokenAddress, spenderAddress)

  const validation = {
    hasAddress: !!tokenAddress,
    hasSufficientBalance: false,
    hasSufficientAllowance: false,
    needsApproval: false,
    amountInWei: BigInt(0),
  }

  if (balance && decimals && amount && tokenAddress && spenderAddress) {
    try {
      const amountInWei = parseUnits(amount, decimals)
      validation.amountInWei = amountInWei
      validation.hasSufficientBalance = balance >= amountInWei
      validation.hasSufficientAllowance = hasAllowance(amountInWei)
      validation.needsApproval = !validation.hasSufficientAllowance
    } catch (error) {
      console.error('Error validating token:', error)
    }
  }

  return validation
} 