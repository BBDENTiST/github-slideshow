export type InvestmentSignal = 'BUY' | 'HOLD' | 'SELL'

export type DomainExtension = '.agent' | '.agi' | '.crypto' | '.wallet' | '.nft' | '.dao' | '.x'

export interface DomainListing {
  id: string
  domain: string
  extension: DomainExtension
  fairMarketValue: number
  floorPrice: number
  investmentSignal: InvestmentSignal
  confidenceScore: number
  semanticScore: number
  liquidityScore: number
  utilityScore: number
  lastSalePrice: number | null
  daysListed: number
  category: string
}

export interface MarketStats {
  totalListings: number
  avgValuation: number
  buySignals: number
  marketVolatilityIndex: number
}
