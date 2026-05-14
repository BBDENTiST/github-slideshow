'use client'

import { categories, extensions } from '@/lib/mock-data'
import { InvestmentSignal } from '@/lib/types'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  selectedCategory: string
  selectedExtension: string
  selectedSignal: InvestmentSignal | 'All'
  minScore: number
  onCategoryChange: (category: string) => void
  onExtensionChange: (extension: string) => void
  onSignalChange: (signal: InvestmentSignal | 'All') => void
  onMinScoreChange: (score: number) => void
}

const signals: (InvestmentSignal | 'All')[] = ['All', 'BUY', 'HOLD', 'SELL']

export function FilterSidebar({
  selectedCategory,
  selectedExtension,
  selectedSignal,
  minScore,
  onCategoryChange,
  onExtensionChange,
  onSignalChange,
  onMinScoreChange
}: FilterSidebarProps) {
  return (
    <aside className="w-64 shrink-0 border-r border-border bg-card/30">
      <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Filter Domains
        </h2>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Category
          </h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                  selectedCategory === category
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Extensions */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Extension
          </h3>
          <div className="space-y-1">
            {extensions.map((extension) => (
              <button
                key={extension}
                onClick={() => onExtensionChange(extension)}
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm font-mono transition-colors',
                  selectedExtension === extension
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {extension}
              </button>
            ))}
          </div>
        </div>

        {/* Investment Signal */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Signal
          </h3>
          <div className="space-y-1">
            {signals.map((signal) => (
              <button
                key={signal}
                onClick={() => onSignalChange(signal)}
                className={cn(
                  'w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors',
                  selectedSignal === signal
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  signal === 'BUY' && selectedSignal !== signal && 'text-[var(--signal-buy)]/70',
                  signal === 'HOLD' && selectedSignal !== signal && 'text-[var(--signal-hold)]/70',
                  signal === 'SELL' && selectedSignal !== signal && 'text-[var(--signal-sell)]/70'
                )}
              >
                {signal === 'All' ? 'All Signals' : signal}
              </button>
            ))}
          </div>
        </div>

        {/* Min Confidence Score */}
        <div className="mb-6">
          <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Min. Confidence Score
          </h3>
          <div className="space-y-3">
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => onMinScoreChange(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">0%</span>
              <span className="font-mono font-semibold text-primary">{minScore}%</span>
              <span className="text-muted-foreground">100%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
