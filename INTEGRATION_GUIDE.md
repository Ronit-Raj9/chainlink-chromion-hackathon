# 🚀 EthBus Frontend-Contract Integration Guide

This guide explains how to connect your deployed EthBus contracts to the frontend interface.

## 📋 Deployed Contracts

- **ShipFactory** (Arbitrum Sepolia): `0x0b990C4E9119321Cfc9Ee7385c97422C4bd9F66C`
- **ShipReceiver** (Ethereum Sepolia): `0x0b990C4E9119321Cfc9Ee7385c97422C4bd9F66C`

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
# Frontend environment
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Get your WalletConnect Project ID from [https://cloud.walletconnect.com](https://cloud.walletconnect.com)

### 2. Install Dependencies

The necessary dependencies are already in your package.json:
- `wagmi` - React hooks for Ethereum
- `viem` - TypeScript interface for Ethereum
- `@rainbow-me/rainbowkit` - Wallet connection UI

### 3. Contract Integration

The integration includes these key files:

#### `lib/contracts.ts`
- Contract addresses and ABIs
- Chain configurations
- Supported tokens

#### `hooks/use-ship-factory.ts`
- React hook for ShipFactory contract interactions
- Create ship functionality
- Fee calculations

#### `hooks/use-ship-state.ts`
- Ship state management
- Real-time updates
- Participant tracking

#### `components/connect-wallet.tsx`
- Wallet connection UI
- Network switching
- Error handling

## 🎯 Key Features Implemented

### ✅ Wallet Connection
- Connect MetaMask, WalletConnect, etc.
- Network detection and switching
- Connected state management

### ✅ Contract Interactions
- Create new ships (cross-chain bridges)
- Calculate fees dynamically
- Track ship states and participants

### ✅ Chain Support
- **Source Chain**: Arbitrum Sepolia (421614)
- **Target Chain**: Ethereum Sepolia (11155111)
- Automatic chain switching prompts

### ✅ Token Support
- ETH (native)
- USDC, LINK (testnet versions)
- Easily extensible for more tokens

## 🚀 How It Works

### 1. User Journey

1. **Connect Wallet** → User connects MetaMask/other wallet
2. **Switch Network** → Auto-prompt to switch to Arbitrum Sepolia
3. **Configure Mission** → Enter amount, token, mission name
4. **Create/Join Ship** → Smart contract call to ShipFactory
5. **Wait for Launch** → Ship fills with participants (simulated for demo)
6. **Bridge Execution** → CCIP cross-chain transfer to Ethereum

### 2. Smart Contract Flow

```mermaid
graph TD
    A[User Creates Ship] --> B[ShipFactory.createShip]
    B --> C[Deploy Ship Contract]
    C --> D[Transfer Tokens to Ship]
    D --> E[Wait for Capacity Fill]
    E --> F[Execute CCIP Bridge]
    F --> G[ShipReceiver on Ethereum]
    G --> H[Distribute Tokens]
```

### 3. Frontend State Management

```typescript
// Ship states
type ShipStatus = 'waiting' | 'ready' | 'launched' | 'completed'

// Real-time updates via polling (can be upgraded to WebSocket/events)
useEffect(() => {
  const interval = setInterval(checkShipStatus, 10000)
  return () => clearInterval(interval)
}, [])
```

## 🔧 Configuration

### Supported Networks

```typescript
// lib/contracts.ts
export const CONTRACTS = {
  ARBITRUM_SEPOLIA: {
    chainId: 421614,
    ShipFactory: "0x0b990C4E9119321Cfc9Ee7385c97422C4bd9F66C"
  },
  ETHEREUM_SEPOLIA: {
    chainId: 11155111,
    ShipReceiver: "0x0b990C4E9119321Cfc9Ee7385c97422C4bd9F66C"
  }
}
```

### CCIP Chain Selectors

```typescript
export const CCIP_CHAIN_SELECTORS = {
  ETHEREUM_SEPOLIA: "16015286601757825753",
  ARBITRUM_SEPOLIA: "3478487238524512106"
}
```

## 🧪 Testing

### Manual Testing Steps

1. **Wallet Connection**
   - Connect MetaMask to Arbitrum Sepolia
   - Verify network switching works

2. **Ship Creation**
   - Enter valid amount (e.g., "0.01")
   - Select token (ETH/USDC/LINK)
   - Click "Launch Mission"
   - Confirm transaction in wallet

3. **Contract Verification**
   - Check transaction on [Arbitrum Sepolia Explorer](https://sepolia.arbiscan.io)
   - Verify ship creation event
   - Monitor for CCIP message

4. **Cross-Chain Verification**
   - Check [Ethereum Sepolia Explorer](https://sepolia.etherscan.io)
   - Verify token receipt on ShipReceiver

### Test Accounts & Tokens

For testing, you'll need:
- **Arbitrum Sepolia ETH** (for gas)
- **Test tokens** (use faucets or mock tokens)

## 🚨 Current Limitations & Future Improvements

### Limitations
- **Participant tracking** is currently mocked (needs real Ship contract integration)
- **Ship capacity** checks are simulated
- **Real-time updates** use polling (should upgrade to events)

### Planned Improvements
1. **Event-based updates** using contract events
2. **Ship discovery** - find existing ships to join
3. **Gas optimization** - batch operations
4. **Multi-token** support in single ship
5. **WebSocket** for real-time participant tracking

## 🛠️ Development Tips

### Adding New Chains

1. Update `lib/contracts.ts` with new contract addresses
2. Add chain to wagmi config in `lib/wagmi.ts`
3. Update CCIP selectors
4. Test wallet switching

### Adding New Tokens

1. Add token addresses to `TEST_TOKENS` in `lib/contracts.ts`
2. Update token selection UI
3. Test token approvals and transfers

### Debugging

- Use browser dev tools to monitor contract calls
- Check wallet transaction history
- Verify contract addresses on block explorers
- Monitor CCIP message status

## 📱 Mobile Support

The interface is responsive and supports mobile wallets through WalletConnect.

## 🔐 Security Notes

- Always verify contract addresses
- Test with small amounts first
- Use testnet for development
- Implement proper error handling

---

## 🚀 Ready to Launch!

Your EthBus frontend is now connected to the deployed contracts. Users can:

1. ✅ Connect their wallets
2. ✅ Switch to the correct networks
3. ✅ Create cross-chain bridge transactions
4. ✅ Track ship status
5. ✅ Receive confirmations

The integration provides a complete user experience for your cross-chain bridging protocol! 