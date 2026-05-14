'use client'

import { TrendingUp, TrendingDown, Minus, Clock, Check } from 'lucide-react'
import { DomainListing } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

interface DomainCardProps {
  domain: DomainListing
  isSelected: boolean
  onSelect: (id: string) => void
}

export function DomainCard({ domain, isSelected, onSelect }: DomainCardProps) {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num)
  }

  const getSignalIcon = () => {
    switch (domain.investmentSignal) {
      case 'BUY':
        return <TrendingUp className="size-4" />
      case 'SELL':
        return <TrendingDown className="size-4" />
      default:
        return <Minus className="size-4" />
    }
  }

  const getSignalColor = () => {
    switch (domain.investmentSignal) {
      case 'BUY':
        return 'bg-[var(--signal-buy)]/10 text-[var(--signal-buy)] border-[var(--signal-buy)]/20'
      case 'SELL':
        return 'bg-[var(--signal-sell)]/10 text-[var(--signal-sell)] border-[var(--signal-sell)]/20'
      default:
        return 'bg-[var(--signal-hold)]/10 text-[var(--signal-hold)] border-[var(--signal-hold)]/20'
    }
  }

  const upliftPercent = domain.lastSalePrice 
    ? Math.round(((domain.fairMarketValue - domain.lastSalePrice) / domain.lastSalePrice) * 100)
    : null

  return (
    <div
      className={cn(
        'group relative rounded-lg border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5',
        isSelected && 'border-primary ring-1 ring-primary/20'
      )}
    >
      {/* Selection checkbox */}
      <div className="absolute right-3 top-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(domain.id)}
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      {/* Domain name */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold text-foreground">{domain.domain}</span>
          <span className="font-mono text-lg text-primary">{domain.extension}</span>
        </div>
        <Badge variant="secondary" className="mt-1.5 text-xs">
          {domain.category}
        </Badge>
      </div>

      {/* Signal badge */}
      <div className="mb-4">
        <span className={cn(
          'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-bold',
          getSignalColor()
        )}>
          {getSignalIcon()}
          {domain.investmentSignal}
        </span>
      </div>

      {/* Valuation */}
      <div className="mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Fair Market Value</span>
          <span className="font-mono font-semibold text-foreground">
            {formatCurrency(domain.fairMarketValue)}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Floor Price</span>
          <span className="font-mono text-muted-foreground">
            {formatCurrency(domain.floorPrice)}
          </span>
        </div>
        {domain.lastSalePrice && upliftPercent !== null && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Sale</span>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-muted-foreground">
                {formatCurrency(domain.lastSalePrice)}
              </span>
              <span className={cn(
                'text-xs font-medium',
                upliftPercent > 0 ? 'text-[var(--signal-buy)]' : 'text-[var(--signal-sell)]'
              )}>
                {upliftPercent > 0 ? '+' : ''}{upliftPercent}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Scores */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <ScoreBar label="Confidence" value={domain.confidenceScore} />
        <ScoreBar label="Semantic" value={domain.semanticScore} />
        <ScoreBar label="Liquidity" value={domain.liquidityScore} />
        <ScoreBar label="Utility" value={domain.utilityScore} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock className="size-3" />
          <span>{domain.daysListed}d listed</span>
        </div>
        <div className="flex items-center gap-1">
          <Check className="size-3" />
          <span>{domain.confidenceScore}% confidence</span>
        </div>
      </div>
    </div>
  )
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-medium">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-muted">
        <div 
          className={cn(
            'h-full rounded-full transition-all',
            value >= 85 ? 'bg-[var(--signal-buy)]' : 
            value >= 70 ? 'bg-[var(--signal-hold)]' : 
            'bg-[var(--signal-sell)]'
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
