"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount, useChainId } from "wagmi"
import { getAllNFTsForOwner, getNFTsForOwner } from "@/lib/alchemy"
import { type NFTAsset } from "@/lib/constants"

interface UseNFTsOptions {
  allChains?: boolean // Fetch from all chains or just current
  excludeSpam?: boolean
}

interface UseNFTsReturn {
  nfts: NFTAsset[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useNFTs(options: UseNFTsOptions = {}): UseNFTsReturn {
  const { allChains = true, excludeSpam = false } = options
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  
  const [nfts, setNfts] = useState<NFTAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNFTs = useCallback(async () => {
    if (!address || !isConnected) {
      setNfts([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      let fetchedNfts: NFTAsset[]
      
      if (allChains) {
        fetchedNfts = await getAllNFTsForOwner(address)
      } else {
        fetchedNfts = await getNFTsForOwner(address, chainId)
      }

      // Optionally filter out spam
      if (excludeSpam) {
        fetchedNfts = fetchedNfts.filter((nft) => !nft.isSpam)
      }

      setNfts(fetchedNfts)
    } catch (err) {
      console.error("Error fetching NFTs:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch NFTs")
      setNfts([])
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected, chainId, allChains, excludeSpam])

  useEffect(() => {
    fetchNFTs()
  }, [fetchNFTs])

  return {
    nfts,
    isLoading,
    error,
    refetch: fetchNFTs,
  }
}
