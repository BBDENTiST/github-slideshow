"use client"

import { useState, useMemo, useCallback } from "react"
import { useAccount } from "wagmi"
import { useNFTs } from "@/hooks/use-nfts"
import { type NFTAsset } from "@/lib/constants"
import { Header } from "@/components/header"
import { NFTGrid } from "@/components/nft-grid"
import { BurnToolbar } from "@/components/burn-toolbar"
import { BurnModal } from "@/components/burn-modal"
import { ConnectPrompt } from "@/components/connect-prompt"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RefreshCw, Filter, AlertTriangle } from "lucide-react"

export default function Home() {
  const { isConnected, address } = useAccount()
  const { nfts, isLoading, error, refetch } = useNFTs({ allChains: true })
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showSpam, setShowSpam] = useState(false)
  const [burnModalOpen, setBurnModalOpen] = useState(false)

  // Get selected NFTs
  const selectedNfts = useMemo(() => {
    return nfts.filter((nft) => selectedIds.has(nft.id))
  }, [nfts, selectedIds])

  // Filter displayed NFTs
  const displayedNfts = useMemo(() => {
    return showSpam ? nfts : nfts.filter((nft) => !nft.isSpam)
  }, [nfts, showSpam])

  // Count spam NFTs
  const spamCount = useMemo(() => {
    return nfts.filter((nft) => nft.isSpam).length
  }, [nfts])

  // Selection handlers
  const handleSelect = useCallback((id: string, selected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (selected) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    const idsToSelect = displayedNfts.map((nft) => nft.id)
    setSelectedIds(new Set(idsToSelect))
  }, [displayedNfts])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const handleBurnComplete = useCallback(() => {
    setSelectedIds(new Set())
    refetch()
  }, [refetch])

  // If not connected, show connect prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <ConnectPrompt />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Your Assets
            </h1>
            <p className="mt-1 text-muted-foreground">
              Select assets to burn and clean your wallet
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Spam filter toggle */}
            {spamCount > 0 && (
              <div className="flex items-center gap-2 rounded-lg glass border border-border/50 px-3 py-2">
                <Switch
                  id="spam-filter"
                  checked={showSpam}
                  onCheckedChange={setShowSpam}
                />
                <Label 
                  htmlFor="spam-filter" 
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Filter className="size-4 text-muted-foreground" />
                  Show Spam
                  <Badge variant="secondary" className="text-xs">
                    {spamCount}
                  </Badge>
                </Label>
              </div>
            )}

            {/* Refresh button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        {!isLoading && nfts.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="gap-1.5">
              {displayedNfts.length} {displayedNfts.length === 1 ? "Asset" : "Assets"}
            </Badge>
            {selectedIds.size > 0 && (
              <Badge variant="default" className="gap-1.5 bg-primary/20 text-primary">
                {selectedIds.size} Selected
              </Badge>
            )}
            {nfts.length !== displayedNfts.length && (
              <Badge variant="secondary" className="gap-1.5">
                <AlertTriangle className="size-3" />
                {nfts.length - displayedNfts.length} hidden (spam)
              </Badge>
            )}
          </div>
        )}

        {/* NFT Grid */}
        <NFTGrid
          nfts={nfts}
          isLoading={isLoading}
          error={error}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          showSpam={showSpam}
        />
      </main>

      {/* Burn Toolbar (fixed at bottom when items selected) */}
      <BurnToolbar
        selectedNfts={selectedNfts}
        totalCount={displayedNfts.length}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onBurnClick={() => setBurnModalOpen(true)}
      />

      {/* Burn Confirmation Modal */}
      <BurnModal
        open={burnModalOpen}
        onOpenChange={setBurnModalOpen}
        selectedNfts={selectedNfts}
        onBurnComplete={handleBurnComplete}
      />
    </div>
  )
}
