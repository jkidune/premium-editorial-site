export type MarketQuote = {
  symbol: string
  name: string
  price: number | null
  change: number | null
  changePercent: number | null
}

export type MarketSnapshot = {
  asOf: string
  source: string
  delayed: boolean
  quotes: MarketQuote[]
  featured: {
    symbol: string
    companyName: string
    exchange: string
    security: string
    currency: string
    price: number | null
    change: number | null
    changePercent: number | null
    dayHigh: number | null
    dayLow: number | null
    closingPrice: number | null
    lastUpdated: string | null
  }
}
