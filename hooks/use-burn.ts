"use client"

import { useState, useCallback } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSendTransaction, useChainId } from "wagmi"
import { parseEther, type Address } from "viem"
import { 
  DEAD_ADDRESS, 
  ERC721_ABI, 
  ERC1155_ABI, 
  FEE_RATES,
  CHAIN_INFO,
  type NFTAsset 
} from "@/lib/constants"

export type BurnStatus = "idle" | "confirming" | "pending" | "success" | "error"

interface BurnResult {
  status: BurnStatus
  txHash?: string
  error?: string
}

interface UseBurnReturn {
  burn: (nfts: NFTAsset[]) => Promise<void>
  burnResult: BurnResult
  estimateFee: (count: number, chainId: number) => { fee: number; symbol: string }
  reset: () => void
}

export function useBurn(): UseBurnReturn {
  const { address } = useAccount()
  const chainId = useChainId()
  const { writeContractAsync } = useWriteContract()
  const { sendTransactionAsync } = useSendTransaction()
  
  const [burnResult, setBurnResult] = useState<BurnResult>({ status: "idle" })

  const treasuryAddress = process.env.NEXT_PUBLIC_TREASURY_ADDRESS as Address | undefined

  const estimateFee = useCallback((count: number, chain: number) => {
    const rate = FEE_RATES[chain] || FEE_RATES[1]
    const info = CHAIN_INFO[chain] || CHAIN_INFO[1]
    return {
      fee: count * rate,
      symbol: info.symbol,
    }
  }, [])

  const burn = useCallback(async (nfts: NFTAsset[]) => {
    if (!address || nfts.length === 0) return

    setBurnResult({ status: "confirming" })

    try {
      // Group NFTs by contract and type for efficient burning
      const erc721ByContract = new Map<string, NFTAsset[]>()
      const erc1155ByContract = new Map<string, NFTAsset[]>()

      for (const nft of nfts) {
        if (nft.tokenType === "ERC721") {
          const existing = erc721ByContract.get(nft.contractAddress) || []
          existing.push(nft)
          erc721ByContract.set(nft.contractAddress, existing)
        } else {
          const existing = erc1155ByContract.get(nft.contractAddress) || []
          existing.push(nft)
          erc1155ByContract.set(nft.contractAddress, existing)
        }
      }

      setBurnResult({ status: "pending" })

      // Calculate and send fee to treasury first (if treasury is set)
      if (treasuryAddress) {
        const { fee } = estimateFee(nfts.length, chainId)
        if (fee > 0) {
          try {
            await sendTransactionAsync({
              to: treasuryAddress,
              value: parseEther(fee.toString()),
            })
          } catch (feeError) {
            // Don't fail the entire burn if fee transfer fails
            console.warn("Fee transfer failed:", feeError)
          }
        }
      }

      let lastTxHash: string | undefined

      // Burn ERC-721 NFTs (one tx per NFT due to contract limitations)
      for (const [contractAddress, contractNfts] of erc721ByContract) {
        for (const nft of contractNfts) {
          try {
            const hash = await writeContractAsync({
              address: contractAddress as Address,
              abi: ERC721_ABI,
              functionName: "safeTransferFrom",
              args: [address, DEAD_ADDRESS as Address, BigInt(nft.tokenId)],
            })
            lastTxHash = hash
          } catch (err) {
            // Try regular transferFrom if safeTransferFrom fails
            try {
              const hash = await writeContractAsync({
                address: contractAddress as Address,
                abi: ERC721_ABI,
                functionName: "transferFrom",
                args: [address, DEAD_ADDRESS as Address, BigInt(nft.tokenId)],
              })
              lastTxHash = hash
            } catch (innerErr) {
              console.error(`Failed to burn ${nft.name}:`, innerErr)
              throw innerErr
            }
          }
        }
      }

      // Burn ERC-1155 NFTs (batch transfer per contract)
      for (const [contractAddress, contractNfts] of erc1155ByContract) {
        const ids = contractNfts.map((nft) => BigInt(nft.tokenId))
        const amounts = contractNfts.map((nft) => BigInt(nft.balance || 1))

        try {
          if (ids.length === 1) {
            // Single transfer
            const hash = await writeContractAsync({
              address: contractAddress as Address,
              abi: ERC1155_ABI,
              functionName: "safeTransferFrom",
              args: [address, DEAD_ADDRESS as Address, ids[0], amounts[0], "0x"],
            })
            lastTxHash = hash
          } else {
            // Batch transfer
            const hash = await writeContractAsync({
              address: contractAddress as Address,
              abi: ERC1155_ABI,
              functionName: "safeBatchTransferFrom",
              args: [address, DEAD_ADDRESS as Address, ids, amounts, "0x"],
            })
            lastTxHash = hash
          }
        } catch (err) {
          console.error(`Failed to burn ERC-1155 batch from ${contractAddress}:`, err)
          throw err
        }
      }

      setBurnResult({ 
        status: "success", 
        txHash: lastTxHash 
      })
    } catch (err) {
      console.error("Burn failed:", err)
      setBurnResult({ 
        status: "error", 
        error: err instanceof Error ? err.message : "Transaction failed" 
      })
    }
  }, [address, chainId, writeContractAsync, sendTransactionAsync, treasuryAddress, estimateFee])

  const reset = useCallback(() => {
    setBurnResult({ status: "idle" })
  }, [])

  return {
    burn,
    burnResult,
    estimateFee,
    reset,
  }
}
