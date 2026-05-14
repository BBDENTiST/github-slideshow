'use client'

import { ShoppingCart, Bookmark, Download, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BulkActionsProps {
  selectedCount: number
  totalValue: number
  onClearSelection: () => void
  onBulkAcquire: () => void
}

export function BulkActions({ 
  selectedCount, 
  totalValue, 
  onClearSelection,
  onBulkAcquire 
}: BulkActionsProps) {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  if (selectedCount === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 mx-auto w-fit">
      <div className="flex items-center gap-4 rounded-xl border border-border bg-card/95 px-4 py-3 shadow-2xl shadow-primary/10 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 font-mono text-lg font-bold text-primary">
            {selectedCount}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">Domains Selected</span>
            <span className="font-mono text-xs text-muted-foreground">
              Total: {formatCurrency(totalValue)}
            </span>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-2"
          >
            <Bookmark className="size-4" />
            Watchlist
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="gap-2"
          >
            <Download className="size-4" />
            Export
          </Button>
          <Button 
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onBulkAcquire}
          >
            <ShoppingCart className="size-4" />
            Bulk Acquire
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            onClick={onClearSelection}
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
