import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { MarketQuote, MarketSnapshot } from '../types/market'

const fallbackQuotes: MarketQuote[] = [
  { symbol: 'WWW', name: 'Wolverine Worldwide', price: null, change: null, changePercent: null },
  { symbol: 'NKE', name: 'Nike', price: null, change: null, changePercent: null },
  { symbol: 'DECK', name: 'Deckers Outdoor', price: null, change: null, changePercent: null },
  { symbol: 'CROX', name: 'Crocs', price: null, change: null, changePercent: null },
  { symbol: 'ONON', name: 'On Holding', price: null, change: null, changePercent: null },
  { symbol: 'BIRK', name: 'Birkenstock', price: null, change: null, changePercent: null },
]

export function useMarketSnapshot() {
  const snapshot = ref<MarketSnapshot | null>(null)
  const isLoading = ref(true)
  const hasError = ref(false)
  const quotes = ref<MarketQuote[]>(fallbackQuotes)

  let refreshTimer: number | undefined
  let controller: AbortController | undefined

  async function loadSnapshot() {
    controller?.abort()
    const requestController = new AbortController()
    controller = requestController

    try {
      const response = await fetch('/api/market', {
        headers: { Accept: 'application/json' },
        signal: requestController.signal,
      })

      if (!response.ok) {
        throw new Error(`Market API returned ${response.status}`)
      }

      const marketData = await response.json() as MarketSnapshot
      snapshot.value = marketData
      quotes.value = marketData.quotes.length
        ? marketData.quotes
        : fallbackQuotes
      hasError.value = false
    } catch (error) {
      if (requestController.signal.aborted) {
        return
      }

      console.error('Unable to load market data.', error)
      hasError.value = true
    } finally {
      if (controller === requestController) {
        isLoading.value = false
      }
    }
  }

  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      void loadSnapshot()
    }
  }

  onMounted(() => {
    void loadSnapshot()
    refreshTimer = window.setInterval(() => {
      void loadSnapshot()
    }, 5 * 60 * 1000)
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onBeforeUnmount(() => {
    controller?.abort()
    window.clearInterval(refreshTimer)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    snapshot,
    quotes,
    isLoading,
    hasError,
    refresh: loadSnapshot,
  }
}
