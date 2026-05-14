"use client"

import { type NFTAsset } from "@/lib/constants"
import { NFTCard } from "./nft-card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Inbox, Search, Wifi, WifiOff } from "lucide-react"

interface NFTGridProps {
  nfts: NFTAsset[]
  isLoading: boolean
  error: string | null
  selectedIds: Set<string>
  onSelect: (id: string, selected: boolean) => void
  showSpam: boolean
}

export function NFTGrid({ 
  nfts, 
  isLoading, 
  error, 
  selectedIds, 
  onSelect,
  showSpam 
}: NFTGridProps) {
  // Filter spam if needed
  const displayedNfts = showSpam ? nfts : nfts.filter((nft) => !nft.isSpam)

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl glass border border-destructive/30 p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
          <WifiOff className="size-8 text-destructive" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-foreground">Connection Error</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl glass border border-border/50">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <div className="mt-3 flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (displayedNfts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-xl glass border border-border/50 p-8">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <Inbox className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-foreground">No Assets Found</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {nfts.length > 0 && !showSpam 
              ? "All your NFTs are marked as spam. Toggle the spam filter to see them."
              : "Your wallet doesn't have any NFTs on supported chains."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {displayedNfts.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          isSelected={selectedIds.has(nft.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
