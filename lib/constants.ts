// Dead address for burning NFTs
export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD" as const

// Supported chain IDs
export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  POLYGON: 137,
  BASE: 8453,
} as const

// Fee rates per chain (approximate $0.01 USD equivalent in native token)
export const FEE_RATES: Record<number, number> = {
  1: 0.000005,      // ETH Mainnet (~$0.01 at $2000/ETH)
  137: 0.01,        // Polygon (~$0.01 at $1/MATIC)
  8453: 0.000005,   // Base (~$0.01 at $2000/ETH)
}

// Chain metadata
export const CHAIN_INFO: Record<number, { name: string; symbol: string; explorer: string; color: string }> = {
  1: { name: "Ethereum", symbol: "ETH", explorer: "https://etherscan.io", color: "#627EEA" },
  137: { name: "Polygon", symbol: "MATIC", explorer: "https://polygonscan.com", color: "#8247E5" },
  8453: { name: "Base", symbol: "ETH", explorer: "https://basescan.org", color: "#0052FF" },
}

// ERC-721 ABI for transfers
export const ERC721_ABI = [
  {
    name: "safeTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "transferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "tokenId", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "ownerOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    name: "isApprovedForAll",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

// ERC-1155 ABI for batch transfers
export const ERC1155_ABI = [
  {
    name: "safeBatchTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "ids", type: "uint256[]" },
      { name: "amounts", type: "uint256[]" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
  {
    name: "safeTransferFrom",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "id", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "data", type: "bytes" },
    ],
    outputs: [],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "account", type: "address" },
      { name: "id", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "isApprovedForAll",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "operator", type: "address" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const

// Token types
export type TokenType = "ERC721" | "ERC1155"

// NFT interface
export interface NFTAsset {
  id: string // unique identifier: `${contractAddress}-${tokenId}`
  contractAddress: string
  tokenId: string
  tokenType: TokenType
  name: string
  description?: string
  image: string
  collection: string
  chainId: number
  isSpam: boolean
  balance?: number // for ERC-1155
}

// Subdomain interface
export interface SubdomainAsset {
  id: string
  name: string
  type: "ENS" | "UD"
  contractAddress: string
  tokenId: string
  chainId: number
}
