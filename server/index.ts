const MARKET_SYMBOLS = [
  { symbol: 'WWW', name: 'Wolverine Worldwide' },
  { symbol: 'NKE', name: 'Nike' },
  { symbol: 'DECK', name: 'Deckers Outdoor' },
  { symbol: 'CROX', name: 'Crocs' },
  { symbol: 'ONON', name: 'On Holding' },
  { symbol: 'BIRK', name: 'Birkenstock' },
] as const

type JsonRecord = Record<string, unknown>

type Quote = {
  symbol: string
  name: string
  price: number | null
  change: number | null
  changePercent: number | null
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null
}

function getRecord(value: unknown, key: string): JsonRecord | null {
  if (!isRecord(value)) {
    return null
  }

  const child = value[key]
  return isRecord(child) ? child : null
}

function getString(value: unknown, key: string): string | null {
  if (!isRecord(value)) {
    return null
  }

  const child = value[key]
  return typeof child === 'string' ? child : null
}

function parseNumber(value: string | null): number | null {
  if (!value || value === 'N/A' || value === 'NA') {
    return null
  }

  const parsed = Number(value.replace(/[$,%+]/g, '').replaceAll(',', ''))
  return Number.isFinite(parsed) ? parsed : null
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

async function fetchNasdaq(path: string): Promise<unknown> {
  const response = await fetch(`https://api.nasdaq.com${path}`, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; WolverineWorldwideMarket/1.0)',
    },
  })

  if (!response.ok) {
    throw new Error(`Nasdaq request failed with ${response.status}`)
  }

  return response.json()
}

async function fetchQuote(
  company: (typeof MARKET_SYMBOLS)[number],
): Promise<Quote> {
  const payload = await fetchNasdaq(
    `/api/quote/${company.symbol}/info?assetclass=stocks`,
  )
  const data = getRecord(payload, 'data')
  const primaryData = getRecord(data, 'primaryData')

  return {
    symbol: company.symbol,
    name: company.name,
    price: parseNumber(getString(primaryData, 'lastSalePrice')),
    change: parseNumber(getString(primaryData, 'netChange')),
    changePercent: parseNumber(getString(primaryData, 'percentageChange')),
  }
}

async function fetchMarketData() {
  const today = new Date()
  const lookback = new Date(today)
  lookback.setUTCDate(lookback.getUTCDate() - 14)

  const [quoteResults, historyPayload] = await Promise.all([
    Promise.allSettled(MARKET_SYMBOLS.map(fetchQuote)),
    fetchNasdaq(
      `/api/quote/WWW/historical?assetclass=stocks&fromdate=${isoDate(lookback)}&todate=${isoDate(today)}&limit=10`,
    ).catch(() => null),
  ])

  const quotes = quoteResults.map((result, index): Quote => {
    if (result.status === 'fulfilled') {
      return result.value
    }

    const company = MARKET_SYMBOLS[index]
    return {
      symbol: company?.symbol ?? '',
      name: company?.name ?? '',
      price: null,
      change: null,
      changePercent: null,
    }
  })

  const featured = quotes[0]
  const data = getRecord(historyPayload, 'data')
  const tradesTable = getRecord(data, 'tradesTable')
  const rowsValue = tradesTable?.rows
  const rows = Array.isArray(rowsValue) ? rowsValue : []
  const latestBar = isRecord(rows[0]) ? rows[0] : null
  const closingPrice = parseNumber(getString(latestBar, 'close'))

  if (featured?.price == null && closingPrice == null) {
    throw new Error('Nasdaq returned no usable Wolverine quote')
  }

  return {
    asOf: new Date().toISOString(),
    source: 'Nasdaq',
    delayed: true,
    quotes,
    featured: {
      symbol: featured?.symbol ?? 'WWW',
      companyName: 'Wolverine World Wide, Inc.',
      exchange: 'NYSE',
      security: 'Common Stock',
      currency: 'USD',
      price: featured?.price ?? closingPrice,
      change: featured?.change ?? null,
      changePercent: featured?.changePercent ?? null,
      dayHigh: parseNumber(getString(latestBar, 'high')),
      dayLow: parseNumber(getString(latestBar, 'low')),
      closingPrice,
      lastUpdated: getString(latestBar, 'date'),
    },
  }
}

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json; charset=utf-8')

  return Response.json(body, {
    ...init,
    headers,
  })
}

export default {
  async fetch(request, _env, ctx): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname !== '/api/market') {
      return new Response('Not found', { status: 404 })
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { Allow: 'GET' },
      })
    }

    const cache = caches.default
    const cacheKey = new Request(url.toString(), request)
    const cachedResponse = await cache.match(cacheKey)

    if (cachedResponse) {
      return cachedResponse
    }

    try {
      const response = jsonResponse(await fetchMarketData(), {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=900',
        },
      })
      ctx.waitUntil(cache.put(cacheKey, response.clone()))
      return response
    } catch (error) {
      console.error(JSON.stringify({
        event: 'market_data_fetch_failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }))

      return jsonResponse(
        { message: 'Market data is temporarily unavailable.' },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store' },
        },
      )
    }
  },
} satisfies ExportedHandler<Env>
