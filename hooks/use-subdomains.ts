"use client"

import { useState, useEffect, useCallback } from "react"
import { useAccount } from "wagmi"
import { normalize } from "viem/ens"
import { type SubdomainAsset } from "@/lib/constants"

// ENS Registry contract on mainnet
const ENS_REGISTRY = "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"

// ENS Name Wrapper contract (where wrapped names are tokenized)
const ENS_NAME_WRAPPER = "0xD4416b13d2b3a9aBae7AcdB5D1A05a6f50D7eC7d"

interface UseSubdomainsReturn {
  subdomains: SubdomainAsset[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSubdomains(): UseSubdomainsReturn {
  const { address, isConnected } = useAccount()
  
  const [subdomains, setSubdomains] = useState<SubdomainAsset[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSubdomains = useCallback(async () => {
    if (!address || !isConnected) {
      setSubdomains([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // For now, we detect ENS subdomains from the NFTs that are already fetched
      // ENS names are ERC-721 tokens on the Name Wrapper contract
      // In a production app, you might query The Graph or ENS subgraph directly
      
      // We'll return an empty array and let the NFT fetching handle ENS detection
      // ENS NFTs will show up in the NFT grid with special handling
      setSubdomains([])
    } catch (err) {
      console.error("Error fetching subdomains:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch subdomains")
      setSubdomains([])
    } finally {
      setIsLoading(false)
    }
  }, [address, isConnected])

  useEffect(() => {
    fetchSubdomains()
  }, [fetchSubdomains])

  return {
    subdomains,
    isLoading,
    error,
    refetch: fetchSubdomains,
  }
}

// Helper to check if an NFT is an ENS name
export function isENSName(contractAddress: string): boolean {
  const normalizedAddress = contractAddress.toLowerCase()
  return (
    normalizedAddress === ENS_NAME_WRAPPER.toLowerCase() ||
    normalizedAddress === "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85" // ENS Base Registrar
  )
}

// Helper to check if an NFT is an Unstoppable Domain
export function isUnstoppableDomain(contractAddress: string): boolean {
  const udContracts = [
    "0x049aba7510f45ba5b64ea9e658e342f904db358d", // .crypto
    "0xa9a6a3626993d487d2dbda3173cf58ca1a9d9e9f", // Polygon UNS
  ]
  return udContracts.includes(contractAddress.toLowerCase())
}
