const MARKET_SYMBOLS = [
  { symbol: 'WWW', name: 'Wolverine Worldwide' },
  { symbol: 'NKE', name: 'Nike' },
  { symbol: 'DECK', name: 'Deckers Outdoor' },
  { symbol: 'CROX', name: 'Crocs' },
  { symbol: 'ONON', name: 'On Holding' },
  { symbol: 'BIRK', name: 'Birkenstock' },
] as const

const SANITY_API_VERSION = '2026-06-30'
const DEFAULT_SANITY_PROJECT_ID = '49js8lcc'
const DEFAULT_SANITY_DATASET = 'production'

const postFields = `
  _id,
  title,
  "slug": slug.current,
  "categories": coalesce(categories, []),
  "imageUrl": featuredImage.asset->url,
  "imageAlt": coalesce(featuredImage.alt, title),
  "excerpt": coalesce(excerpt, ""),
  publishedAt,
  body
`

const latestPostsQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    coalesce(isPublished, true) == true
  ]
  | order(publishedAt desc)[0...3] {
    ${postFields}
  }
`

const allPostsQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    coalesce(isPublished, true) == true
  ]
  | order(publishedAt desc) {
    ${postFields}
  }
`

const postBySlugQuery = `
  *[
    _type == "post" &&
    slug.current == $slug &&
    coalesce(isPublished, true) == true
  ][0] {
    ${postFields}
  }
`

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

function safeSanityIdentifier(value: string | undefined, fallback: string) {
  return value && /^[a-z0-9_-]+$/i.test(value)
    ? value
    : fallback
}

async function fetchSanityNews(url: URL, env: Env): Promise<unknown> {
  const projectId = safeSanityIdentifier(
    env.VITE_SANITY_PROJECT_ID,
    DEFAULT_SANITY_PROJECT_ID,
  )
  const dataset = safeSanityIdentifier(
    env.VITE_SANITY_DATASET,
    DEFAULT_SANITY_DATASET,
  )
  const slug = url.searchParams.get('slug')
  const mode = url.searchParams.get('mode')
  const query = slug
    ? postBySlugQuery
    : mode === 'all'
      ? allPostsQuery
      : latestPostsQuery

  const endpoint = new URL(
    `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${dataset}`,
  )
  endpoint.searchParams.set('query', query)

  if (slug) {
    endpoint.searchParams.set('$slug', JSON.stringify(slug))
  }

  const response = await fetch(endpoint, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`Sanity request failed with ${response.status}`)
  }

  const payload: unknown = await response.json()

  if (!isRecord(payload) || !('result' in payload)) {
    throw new Error('Sanity returned an invalid response')
  }

  return payload.result
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
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname !== '/api/market' && url.pathname !== '/api/news') {
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
      const isNewsRequest = url.pathname === '/api/news'
      const body = isNewsRequest
        ? await fetchSanityNews(url, env)
        : await fetchMarketData()
      const response = jsonResponse(body, {
        headers: {
          'Cache-Control': isNewsRequest
            ? 'public, max-age=60, stale-while-revalidate=300'
            : 'public, max-age=300, stale-while-revalidate=900',
        },
      })
      ctx.waitUntil(cache.put(cacheKey, response.clone()))
      return response
    } catch (error) {
      console.error(JSON.stringify({
        event: url.pathname === '/api/news'
          ? 'sanity_news_fetch_failed'
          : 'market_data_fetch_failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }))

      return jsonResponse(
        {
          message: url.pathname === '/api/news'
            ? 'News is temporarily unavailable.'
            : 'Market data is temporarily unavailable.',
        },
        {
          status: 502,
          headers: { 'Cache-Control': 'no-store' },
        },
      )
    }
  },
} satisfies ExportedHandler<Env>
