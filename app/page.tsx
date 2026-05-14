'use client'

import { useState, useMemo } from 'react'
import { ArrowUpDown, Grid3X3, List, SlidersHorizontal } from 'lucide-react'
import { MarketplaceHeader } from '@/components/marketplace/header'
import { MarketStatsBar } from '@/components/marketplace/market-stats'
import { FilterSidebar } from '@/components/marketplace/filter-sidebar'
import { DomainCard } from '@/components/marketplace/domain-card'
import { BulkActions } from '@/components/marketplace/bulk-actions'
import { Button } from '@/components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { mockDomains, mockMarketStats } from '@/lib/mock-data'
import { InvestmentSignal } from '@/lib/types'

type SortOption = 'fmv-desc' | 'fmv-asc' | 'confidence-desc' | 'days-asc' | 'uplift-desc'

export default function MarketplacePage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedExtension, setSelectedExtension] = useState('All Extensions')
  const [selectedSignal, setSelectedSignal] = useState<InvestmentSignal | 'All'>('All')
  const [minScore, setMinScore] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>('fmv-desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDomains, setSelectedDomains] = useState<Set<string>>(new Set())
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter and sort domains
  const filteredDomains = useMemo(() => {
    let result = mockDomains.filter(domain => {
      if (selectedCategory !== 'All Categories' && domain.category !== selectedCategory) {
        return false
      }
      if (selectedExtension !== 'All Extensions' && domain.extension !== selectedExtension) {
        return false
      }
      if (selectedSignal !== 'All' && domain.investmentSignal !== selectedSignal) {
        return false
      }
      if (domain.confidenceScore < minScore) {
        return false
      }
      return true
    })

    // Sort
    switch (sortBy) {
      case 'fmv-desc':
        result = result.sort((a, b) => b.fairMarketValue - a.fairMarketValue)
        break
      case 'fmv-asc':
        result = result.sort((a, b) => a.fairMarketValue - b.fairMarketValue)
        break
      case 'confidence-desc':
        result = result.sort((a, b) => b.confidenceScore - a.confidenceScore)
        break
      case 'days-asc':
        result = result.sort((a, b) => a.daysListed - b.daysListed)
        break
      case 'uplift-desc':
        result = result.sort((a, b) => {
          const aUplift = a.lastSalePrice ? ((a.fairMarketValue - a.lastSalePrice) / a.lastSalePrice) : 0
          const bUplift = b.lastSalePrice ? ((b.fairMarketValue - b.lastSalePrice) / b.lastSalePrice) : 0
          return bUplift - aUplift
        })
        break
    }

    return result
  }, [selectedCategory, selectedExtension, selectedSignal, minScore, sortBy])

  const handleSelectDomain = (id: string) => {
    setSelectedDomains(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleClearSelection = () => {
    setSelectedDomains(new Set())
  }

  const handleBulkAcquire = () => {
    alert(`Initiating bulk acquisition for ${selectedDomains.size} domains...`)
  }

  const totalSelectedValue = useMemo(() => {
    return mockDomains
      .filter(d => selectedDomains.has(d.id))
      .reduce((sum, d) => sum + d.floorPrice, 0)
  }, [selectedDomains])

  const buySignalCount = filteredDomains.filter(d => d.investmentSignal === 'BUY').length

  return (
    <div className="flex min-h-screen flex-col">
      <MarketplaceHeader />
      <MarketStatsBar stats={mockMarketStats} />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <FilterSidebar
            selectedCategory={selectedCategory}
            selectedExtension={selectedExtension}
            selectedSignal={selectedSignal}
            minScore={minScore}
            onCategoryChange={setSelectedCategory}
            onExtensionChange={setSelectedExtension}
            onSignalChange={setSelectedSignal}
            onMinScoreChange={setMinScore}
          />
        </div>

        {/* Mobile Filters Sheet */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="absolute inset-y-0 left-0 w-80">
              <FilterSidebar
                selectedCategory={selectedCategory}
                selectedExtension={selectedExtension}
                selectedSignal={selectedSignal}
                minScore={minScore}
                onCategoryChange={setSelectedCategory}
                onExtensionChange={setSelectedExtension}
                onSignalChange={setSelectedSignal}
                onMinScoreChange={setMinScore}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 lg:hidden"
                onClick={() => setShowMobileFilters(true)}
              >
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
              <h1 className="text-xl font-semibold">
                Marketplace
              </h1>
              <span className="text-sm text-muted-foreground">
                {filteredDomains.length} domains
                {buySignalCount > 0 && (
                  <span className="ml-1 text-[var(--signal-buy)]">
                    ({buySignalCount} BUY signals)
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-48 bg-card">
                  <ArrowUpDown className="mr-2 size-4 text-muted-foreground" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fmv-desc">Highest Value</SelectItem>
                  <SelectItem value="fmv-asc">Lowest Value</SelectItem>
                  <SelectItem value="confidence-desc">Highest Confidence</SelectItem>
                  <SelectItem value="days-asc">Recently Listed</SelectItem>
                  <SelectItem value="uplift-desc">Highest Uplift</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex rounded-md border border-border">
                <Button 
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="size-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('list')}
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Domain Grid */}
          {filteredDomains.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3' 
              : 'flex flex-col gap-3'
            }>
              {filteredDomains.map((domain) => (
                <DomainCard
                  key={domain.id}
                  domain={domain}
                  isSelected={selectedDomains.has(domain.id)}
                  onSelect={handleSelectDomain}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 text-6xl">🔍</div>
              <h2 className="mb-2 text-xl font-semibold">No domains found</h2>
              <p className="text-muted-foreground">
                Try adjusting your filters to find more results.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Bulk Actions Bar */}
      <BulkActions
        selectedCount={selectedDomains.size}
        totalValue={totalSelectedValue}
        onClearSelection={handleClearSelection}
        onBulkAcquire={handleBulkAcquire}
      />
    </div>
  )
}
