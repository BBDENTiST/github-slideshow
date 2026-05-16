# 0xagent — Web3 NFT & Subdomain Burner

A production-ready, premium Web3 utility platform that acts as a "Wallet Cleaner" for advanced users. Users can connect their multi-chain wallets, view their NFTs and Web3 subdomains, and permanently burn unwanted/spam assets via a streamlined bulk-burn mechanism.

## 🚀 Features

- **Multi-Chain Support**: Ethereum, Polygon, and Base chain integration
- **Bulk NFT Burning**: Select and burn multiple NFTs in a single transaction
- **Premium Domain Protection**: Safety lock for high-value digital assets (.agi, .agent, .web3, .dao, .eth, .nft)
- **Real-time NFT Fetching**: Powered by Alchemy SDK for accurate metadata
- **Monetization Layer**: $0.01 micro-fee per burned item (configurable)
- **Enterprise UI**: Dark mode cybersecurity aesthetic with glassmorphism effects
- **Responsive Design**: Mobile-first, works on all screen sizes

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v3 + shadcn/ui patterns
- **Web3**: 
  - `wagmi@2` - React hooks for Ethereum
  - `viem@2` - Modern Ethereum library
  - `@rainbow-me/rainbowkit@2` - Wallet connection UI
  - `@tanstack/react-query@5` - Data fetching & caching
- **API**: Alchemy SDK for NFT data

## 📦 Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=7d6bb43ded97246e14f5100410ba2d8a
NEXT_PUBLIC_ALCHEMY_API_KEY=-vmGja_vYilmzb8AwYojg
NEXT_PUBLIC_TREASURY_ADDRESS=0xf7165248E5F0562c27f8FEFa55288C640d4C953a
NEXT_PUBLIC_DEAD_ADDRESS=0x000000000000000000000000000000000000dEaD
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## 📁 Project Structure

```
/app
  ├── layout.tsx           # Root layout with providers
  ├── page.tsx             # Home page
  └── globals.css          # Global styles & design tokens

/components
  ├── WalletProvider.tsx   # Web3 providers wrapper
  ├── Header.tsx           # App header with connect button
  ├── NftCard.tsx          # Individual NFT card component
  └── NftGrid.tsx          # NFT grid with selection & burn logic

/hooks
  ├── useNFTs.ts          # Fetch NFTs from Alchemy
  └── useBurn.ts          # Burn NFTs to dead address + treasury payment

/lib
  ├── wagmiConfig.ts      # Wagmi configuration with chains
  └── alchemy.ts          # Alchemy API helpers & NFT normalization
```

## 🔑 Core Functionality

### 1. **NFT Fetching** (`hooks/useNFTs.ts`)
- Fetches NFTs from Ethereum, Polygon, and Base chains
- Uses TanStack Query for caching and data management
- Normalizes metadata across different chain APIs
- Identifies premium domains automatically

### 2. **NFT Burning** (`hooks/useBurn.ts`)
- Encodes `safeTransferFrom` (ERC721) and `safeTransferFrom` (ERC1155) calls
- Sends NFTs to dead address (`0x000...dEaD`)
- Collects $0.01 fee per item to treasury address
- Handles multi-chain transactions
- Includes error recovery for failed individual burns

### 3. **UI Components** (`components/`)
- **Header**: Sticky header with logo and RainbowKit connect button
- **NFTCard**: Card with image, name, chain badge, premium warning, checkbox
- **NFTGrid**: Manages selection state, displays bulk toolbar with fee calculator
- Premium domains show visual warnings and cannot be selected by default

## 🎨 Design System

### Colors (Cyber Dark Theme)
- **Background**: `#0d0d0d` (Near black)
- **Accent**: `#00D1FF` (Neon Blue)
- **Card**: `#1f1f1f` (Dark gray)
- **Text**: `#f0f0f0` (Light gray)

### Components
- Glassmorphism panels with backdrop blur
- Soft shadows for depth
- Smooth transitions and hover states
- Accessible color contrast (WCAG AA+)

## 🔐 Security Features

- **Premium Domain Protection**: Rare domains locked by default
- **Visual Warnings**: Premium assets show alert badge
- **Safe Burn Mechanism**: Uses standard token standards (ERC721/1155)
- **Error Handling**: Individual NFT failures don't stop batch operations
- **Input Validation**: Address validation, token ID checks

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel Dashboard
4. Deploy

```bash
vercel deploy
```

## 📊 API Rate Limits

- **Alchemy**: Free tier supports ~100 requests/second
- Implement rate limiting for production use

## 🐛 Troubleshooting

### "Wallet not connected"
- Ensure RainbowKit button is visible and clickable
- Check WalletConnect Project ID in `.env.local`

### "No NFTs found"
- Verify Alchemy API key is valid
- Check if wallet has NFTs on selected chains
- Check browser console for API errors

### Transaction failures
- Ensure sufficient gas for burn transactions
- Verify treasury address is correct
- Check if contract supports `safeTransferFrom`

## 📝 License

MIT

---

**0xagent** — Premium Web3 Wallet Cleaner
Burn with confidence. Your assets, your control.
