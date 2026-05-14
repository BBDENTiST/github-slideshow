'use client'

import { TrendingUp, BarChart3, Zap, Activity } from 'lucide-react'
import { MarketStats } from '@/lib/types'

interface MarketStatsBarProps {
  stats: MarketStats
}

export function MarketStatsBar({ stats }: MarketStatsBarProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  return (
    <div className="border-b border-border bg-card/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 overflow-x-auto px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <BarChart3 className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Total Listings</span>
            <span className="font-mono text-sm font-semibold">{formatNumber(stats.totalListings)}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-accent/10">
            <TrendingUp className="size-4 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Avg. Valuation</span>
            <span className="font-mono text-sm font-semibold">{formatCurrency(stats.avgValuation)}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-[var(--signal-buy)]/10">
            <Zap className="size-4 text-[var(--signal-buy)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">BUY Signals</span>
            <span className="font-mono text-sm font-semibold text-[var(--signal-buy)]">{formatNumber(stats.buySignals)}</span>
          </div>
        </div>

        <div className="h-8 w-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
            <Activity className="size-4 text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Market Volatility Index</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold">{stats.marketVolatilityIndex}</span>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${stats.marketVolatilityIndex}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
