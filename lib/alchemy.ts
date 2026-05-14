import { Alchemy, Network, NftTokenType } from "alchemy-sdk"
import { type NFTAsset } from "./constants"

// Map chain IDs to Alchemy networks
const CHAIN_TO_NETWORK: Record<number, Network> = {
  1: Network.ETH_MAINNET,
  137: Network.MATIC_MAINNET,
  8453: Network.BASE_MAINNET,
}

// Create Alchemy instance for a specific chain
function getAlchemyInstance(chainId: number): Alchemy {
  const network = CHAIN_TO_NETWORK[chainId]
  if (!network) {
    throw new Error(`Unsupported chain ID: ${chainId}`)
  }

  return new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",
    network,
  })
}

// Placeholder image for NFTs without images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%231a1a2e' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2300D1FF' font-family='monospace' font-size='24'%3ENo Image%3C/text%3E%3C/svg%3E"

// Normalize image URL (handle IPFS, etc.)
function normalizeImageUrl(url: string | undefined): string {
  if (!url) return PLACEHOLDER_IMAGE
  
  // Handle IPFS URLs
  if (url.startsWith("ipfs://")) {
    return `https://ipfs.io/ipfs/${url.slice(7)}`
  }
  
  // Handle data URIs
  if (url.startsWith("data:")) {
    return url
  }
  
  // Handle relative URLs or invalid URLs
  if (!url.startsWith("http")) {
    return PLACEHOLDER_IMAGE
  }
  
  return url
}

// Fetch NFTs for an owner on a specific chain
export async function getNFTsForOwner(
  ownerAddress: string,
  chainId: number
): Promise<NFTAsset[]> {
  try {
    const alchemy = getAlchemyInstance(chainId)
    
    const response = await alchemy.nft.getNftsForOwner(ownerAddress, {
      excludeFilters: [], // Include all NFTs, we'll filter spam in UI
    })

    const nfts: NFTAsset[] = response.ownedNfts.map((nft) => {
      const tokenType = nft.tokenType === NftTokenType.ERC1155 ? "ERC1155" : "ERC721"
      
      return {
        id: `${nft.contract.address}-${nft.tokenId}`,
        contractAddress: nft.contract.address,
        tokenId: nft.tokenId,
        tokenType,
        name: nft.name || nft.raw?.metadata?.name || `#${nft.tokenId}`,
        description: nft.description || nft.raw?.metadata?.description,
        image: normalizeImageUrl(
          nft.image?.cachedUrl || 
          nft.image?.thumbnailUrl || 
          nft.image?.originalUrl ||
          nft.raw?.metadata?.image
        ),
        collection: nft.contract.name || nft.contract.openSeaMetadata?.collectionName || "Unknown Collection",
        chainId,
        isSpam: nft.contract.isSpam || false,
        balance: tokenType === "ERC1155" ? Number(nft.balance) : 1,
      }
    })

    return nfts
  } catch (error) {
    console.error(`Error fetching NFTs for chain ${chainId}:`, error)
    return []
  }
}

// Fetch NFTs across all supported chains
export async function getAllNFTsForOwner(ownerAddress: string): Promise<NFTAsset[]> {
  const chainIds = Object.keys(CHAIN_TO_NETWORK).map(Number)
  
  const results = await Promise.all(
    chainIds.map((chainId) => getNFTsForOwner(ownerAddress, chainId))
  )
  
  return results.flat()
}
