"use client"

import { useChainId } from "wagmi"
import { useBurn, type BurnStatus } from "@/hooks/use-burn"
import { type NFTAsset, CHAIN_INFO } from "@/lib/constants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  Flame, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  AlertTriangle,
  Trash2
} from "lucide-react"

interface BurnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedNfts: NFTAsset[]
  onBurnComplete: () => void
}

export function BurnModal({ 
  open, 
  onOpenChange, 
  selectedNfts,
  onBurnComplete 
}: BurnModalProps) {
  const chainId = useChainId()
  const { burn, burnResult, estimateFee, reset } = useBurn()
  const chainInfo = CHAIN_INFO[chainId]

  const { fee, symbol } = estimateFee(selectedNfts.length, chainId)
  const { status, txHash, error } = burnResult

  const handleBurn = async () => {
    await burn(selectedNfts)
  }

  const handleClose = () => {
    if (status === "success") {
      onBurnComplete()
    }
    reset()
    onOpenChange(false)
  }

  const getExplorerUrl = (hash: string) => {
    return `${chainInfo?.explorer || "https://etherscan.io"}/tx/${hash}`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border/50 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {status === "idle" && (
              <>
                <Trash2 className="size-5 text-destructive" />
                Confirm Burn
              </>
            )}
            {(status === "confirming" || status === "pending") && (
              <>
                <Loader2 className="size-5 animate-spin text-primary" />
                {status === "confirming" ? "Confirm in Wallet" : "Burning Assets..."}
              </>
            )}
            {status === "success" && (
              <>
                <CheckCircle2 className="size-5 text-green-500" />
                Wallet Cleaned!
              </>
            )}
            {status === "error" && (
              <>
                <XCircle className="size-5 text-destructive" />
                Burn Failed
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {status === "idle" && "This action cannot be undone. The assets will be permanently destroyed."}
            {status === "confirming" && "Please confirm the transaction in your wallet..."}
            {status === "pending" && "Cleaning your wallet... Please wait."}
            {status === "success" && "Your selected assets have been successfully burned."}
            {status === "error" && "Something went wrong. Please try again."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Confirm State */}
          {status === "idle" && (
            <>
              {/* Asset list */}
              <div className="rounded-lg border border-border/50 bg-muted/30">
                <div className="border-b border-border/50 px-4 py-2">
                  <p className="text-sm font-medium text-foreground">
                    Assets to burn ({selectedNfts.length})
                  </p>
                </div>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2 p-4">
                    {selectedNfts.map((nft) => (
                      <div 
                        key={nft.id} 
                        className="flex items-center gap-3 rounded-lg bg-background/50 p-2"
                      >
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="size-10 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {nft.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {nft.collection}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {CHAIN_INFO[nft.chainId]?.name || "Unknown"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Fee info */}
              <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
                <span className="text-sm text-muted-foreground">Service Fee</span>
                <span className="font-mono text-sm font-medium text-foreground">
                  {fee.toFixed(6)} {symbol}
                </span>
              </div>

              {/* Warning */}
              <div className="flex gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                <AlertTriangle className="size-5 shrink-0 text-yellow-500" />
                <p className="text-sm text-yellow-200">
                  Burning sends assets to a dead address. This is permanent and cannot be reversed.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBurn}
                  className={cn(
                    "flex-1 gap-2 bg-gradient-to-r from-destructive to-orange-600",
                    "hover:from-destructive/90 hover:to-orange-500",
                    "text-white font-semibold"
                  )}
                >
                  <Flame className="size-4" />
                  Burn Assets
                </Button>
              </div>
            </>
          )}

          {/* Pending State */}
          {(status === "confirming" || status === "pending") && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="relative">
                <div className="size-20 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 size-20 animate-spin rounded-full border-4 border-transparent border-t-primary" />
                <Flame className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  {status === "confirming" ? "Waiting for confirmation..." : "Cleaning wallet..."}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {status === "confirming" 
                    ? "Please confirm the transaction in your wallet" 
                    : "Please don't close this window"}
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex size-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="size-10 text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  {selectedNfts.length} {selectedNfts.length === 1 ? "asset" : "assets"} burned successfully!
                </p>
                {txHash && (
                  <a
                    href={getExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View transaction
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              <Button onClick={handleClose} className="mt-4">
                Done
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex size-20 items-center justify-center rounded-full bg-destructive/20">
                <XCircle className="size-10 text-destructive" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Transaction Failed</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  {error || "An unknown error occurred"}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={() => { reset(); handleBurn() }}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
