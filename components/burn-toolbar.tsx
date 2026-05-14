"use client"

import { useChainId } from "wagmi"
import { useBurn } from "@/hooks/use-burn"
import { type NFTAsset, CHAIN_INFO } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Flame, X, CheckSquare, Square } from "lucide-react"

interface BurnToolbarProps {
  selectedNfts: NFTAsset[]
  totalCount: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBurnClick: () => void
}

export function BurnToolbar({
  selectedNfts,
  totalCount,
  onSelectAll,
  onClearSelection,
  onBurnClick,
}: BurnToolbarProps) {
  const chainId = useChainId()
  const { estimateFee } = useBurn()
  const chainInfo = CHAIN_INFO[chainId]

  const selectedCount = selectedNfts.length
  const { fee, symbol } = estimateFee(selectedCount, chainId)

  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="glass rounded-2xl border border-primary/30 p-4 shadow-2xl glow-primary-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left side - Selection info */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge 
                variant="secondary" 
                className="gap-1.5 bg-primary/10 text-primary border-primary/30"
              >
                <CheckSquare className="size-3.5" />
                {selectedCount} of {totalCount} selected
              </Badge>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSelectAll}
                  className="h-8 gap-1.5 text-xs hover:bg-primary/10 hover:text-primary"
                >
                  <Square className="size-3.5" />
                  Select All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  className="h-8 gap-1.5 text-xs hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3.5" />
                  Clear
                </Button>
              </div>
            </div>

            {/* Right side - Fee + Burn button */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estimated Fee</p>
                <p className="font-mono text-sm font-medium text-foreground">
                  {fee.toFixed(6)} {symbol}
                </p>
              </div>
              
              <Button
                onClick={onBurnClick}
                className={cn(
                  "gap-2 bg-gradient-to-r from-destructive to-orange-600",
                  "hover:from-destructive/90 hover:to-orange-500",
                  "text-white font-semibold shadow-lg",
                  "transition-all duration-300 hover:scale-105",
                  "hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]"
                )}
              >
                <Flame className="size-4" />
                Burn {selectedCount} {selectedCount === 1 ? "Asset" : "Assets"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
