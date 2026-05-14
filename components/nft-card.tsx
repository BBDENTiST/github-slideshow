"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { type NFTAsset, CHAIN_INFO } from "@/lib/constants"
import { isENSName, isUnstoppableDomain } from "@/hooks/use-subdomains"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Globe, Link2 } from "lucide-react"

interface NFTCardProps {
  nft: NFTAsset
  isSelected: boolean
  onSelect: (id: string, selected: boolean) => void
}

export function NFTCard({ nft, isSelected, onSelect }: NFTCardProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const chainInfo = CHAIN_INFO[nft.chainId]
  const isENS = isENSName(nft.contractAddress)
  const isUD = isUnstoppableDomain(nft.contractAddress)
  const isDomain = isENS || isUD

  const handleClick = () => {
    onSelect(nft.id, !isSelected)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative cursor-pointer overflow-hidden rounded-xl glass border transition-all duration-300",
        isSelected 
          ? "border-primary glow-primary-sm" 
          : "border-border/50 hover:border-primary/30",
        "hover:scale-[1.02] hover:shadow-lg"
      )}
    >
      {/* Selection Checkbox */}
      <div className="absolute right-2 top-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(nft.id, checked as boolean)}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "size-5 rounded-md border-2 transition-all",
            isSelected 
              ? "border-primary bg-primary data-[state=checked]:bg-primary" 
              : "border-muted-foreground/50 bg-background/80"
          )}
        />
      </div>

      {/* Spam Badge */}
      {nft.isSpam && (
        <div className="absolute left-2 top-2 z-10">
          <Badge variant="destructive" className="gap-1 text-xs">
            <AlertTriangle className="size-3" />
            Spam
          </Badge>
        </div>
      )}

      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {/* Loading skeleton */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted-foreground/10" />
        )}
        
        {/* NFT Image */}
        {!imageError ? (
          <img
            src={nft.image}
            alt={nft.name}
            className={cn(
              "size-full object-cover transition-all duration-500",
              imageLoaded ? "opacity-100" : "opacity-0",
              "group-hover:scale-110"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-muted to-secondary">
            {isDomain ? (
              <Globe className="size-12 text-primary/50" />
            ) : (
              <Link2 className="size-12 text-muted-foreground/50" />
            )}
          </div>
        )}

        {/* Hover overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent",
          "opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        )} />
      </div>

      {/* Info Section */}
      <div className="relative p-3">
        {/* Domain badge for ENS/UD */}
        {isDomain && (
          <Badge 
            variant="secondary" 
            className="mb-2 gap-1 border border-accent/30 bg-accent/10 text-accent"
          >
            <Globe className="size-3" />
            {isENS ? "ENS" : "UD"}
          </Badge>
        )}

        {/* Name */}
        <h3 className="truncate font-medium text-foreground">
          {nft.name}
        </h3>

        {/* Collection */}
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {nft.collection}
        </p>

        {/* Footer: Chain + Token Type */}
        <div className="mt-2 flex items-center justify-between">
          <Badge variant="outline" className="gap-1 text-xs">
            <span 
              className="size-2 rounded-full" 
              style={{ backgroundColor: chainInfo?.color || "#888" }}
            />
            {chainInfo?.name || "Unknown"}
          </Badge>
          
          {nft.tokenType === "ERC1155" && nft.balance && nft.balance > 1 && (
            <Badge variant="secondary" className="text-xs">
              x{nft.balance}
            </Badge>
          )}
        </div>
      </div>

      {/* Selection glow effect */}
      {isSelected && (
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-primary/50 ring-offset-2 ring-offset-background" />
      )}
    </div>
  )
}
