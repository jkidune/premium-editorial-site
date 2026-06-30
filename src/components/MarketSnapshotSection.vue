<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import EditorialButton from './EditorialButton.vue'
import { useMarketSnapshot } from '../composables/useMarketSnapshot'

const sectionElement = ref<HTMLElement | null>(null)
const isRevealReady = ref(false)
const isRevealed = ref(false)

const { snapshot, quotes, isLoading, hasError } = useMarketSnapshot()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPrice(value: number | null | undefined, showSymbol = true) {
  if (value == null) {
    return '—'
  }

  return showSymbol
    ? currencyFormatter.format(value)
    : value.toFixed(2)
}

function formatChange(value: number | null) {
  if (value == null) {
    return '—'
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
}

const metrics = computed(() => [
  {
    label: 'Day’s High',
    value: formatPrice(snapshot.value?.featured.dayHigh),
  },
  {
    label: 'Day’s Low',
    value: formatPrice(snapshot.value?.featured.dayLow),
  },
  {
    label: 'Closing Price',
    value: formatPrice(snapshot.value?.featured.closingPrice),
  },
  {
    label: 'Last Updated',
    value: snapshot.value?.featured.lastUpdated ?? (isLoading.value ? 'Loading…' : 'Unavailable'),
  },
])

let observer: IntersectionObserver | undefined

onMounted(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (prefersReducedMotion || !sectionElement.value) {
    isRevealed.value = true
    return
  }

  isRevealReady.value = true

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) {
        return
      }

      isRevealed.value = true
      observer?.disconnect()
    },
    {
      threshold: 0.2,
    },
  )

  observer.observe(sectionElement.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <section
    ref="sectionElement"
    class="market-snapshot"
    :class="{
      'market-snapshot--reveal-ready': isRevealReady,
      'market-snapshot--revealed': isRevealed,
    }"
    aria-labelledby="market-snapshot-title"
  >
    <div class="market-snapshot__container">
      <div class="market-snapshot__content market-snapshot__reveal market-snapshot__reveal--one">
        <p class="market-snapshot__statement">
          Many brands,<br>
          one shared culture,<br>
          limitless innovation.
        </p>

        <div class="market-snapshot__culture">
          <p>
            Our culture fuels curiosity, creativity, and collaboration. Across our global campuses,
            teams push boundaries in product design, brand storytelling, and digital innovation,
            shaping the future of footwear and apparel.
          </p>

          <EditorialButton
            href="https://careers.wolverineworldwide.com/"
            icon="external"
            external
          >
            Explore Career Opportunities
          </EditorialButton>
        </div>
      </div>

      <div class="market-snapshot__panel">
        <div class="market-snapshot__intro">
          <h2
            id="market-snapshot-title"
            class="market-snapshot__title market-snapshot__reveal market-snapshot__reveal--one"
          >
            Market Snapshot
          </h2>

          <div class="market-snapshot__action market-snapshot__reveal market-snapshot__reveal--two">
            <EditorialButton
              to="/investors"
              variant="secondary"
              size="compact"
            >
              Investor Relations
            </EditorialButton>
          </div>
        </div>

        <div class="market-snapshot__data">
          <div
            class="market-ticker market-snapshot__reveal market-snapshot__reveal--one"
            aria-label="Delayed market prices"
          >
            <div class="market-ticker__track">
              <div class="market-ticker__group">
                <span
                  v-for="quote in quotes"
                  :key="quote.symbol"
                  class="market-ticker__item"
                  :class="{ 'market-ticker__item--featured': quote.symbol === 'WWW' }"
                >
                  <strong>{{ quote.symbol }}</strong>
                  <span>{{ quote.name }}</span>
                  <span>{{ formatPrice(quote.price) }}</span>
                  <em
                    :class="{
                      'market-ticker__change--up': (quote.changePercent ?? 0) > 0,
                      'market-ticker__change--down': (quote.changePercent ?? 0) < 0,
                    }"
                  >
                    {{ formatChange(quote.changePercent) }}
                  </em>
                </span>
              </div>

              <div class="market-ticker__group" aria-hidden="true">
                <span
                  v-for="quote in quotes"
                  :key="`duplicate-${quote.symbol}`"
                  class="market-ticker__item"
                  :class="{ 'market-ticker__item--featured': quote.symbol === 'WWW' }"
                >
                  <strong>{{ quote.symbol }}</strong>
                  <span>{{ quote.name }}</span>
                  <span>{{ formatPrice(quote.price) }}</span>
                  <em>{{ formatChange(quote.changePercent) }}</em>
                </span>
              </div>
            </div>
          </div>

          <div class="market-snapshot__price-row market-snapshot__reveal market-snapshot__reveal--two">
            <div>
              <div class="market-snapshot__company">
                Wolverine World Wide, Inc. (WWW)
              </div>

              <strong class="market-snapshot__price">
                {{ formatPrice(snapshot?.featured.price, false) }}
              </strong>
            </div>

            <div class="market-snapshot__quote-meta">
              <span>{{ snapshot?.featured.currency ?? 'USD' }}</span>
              <span
                v-if="snapshot?.featured.changePercent != null"
                :class="{
                  'market-snapshot__change--up': snapshot.featured.changePercent > 0,
                  'market-snapshot__change--down': snapshot.featured.changePercent < 0,
                }"
              >
                {{ formatChange(snapshot.featured.changePercent) }}
              </span>
            </div>
          </div>

          <dl class="market-snapshot__metrics market-snapshot__reveal market-snapshot__reveal--three">
            <div
              v-for="metric in metrics"
              :key="metric.label"
              class="market-snapshot__metric"
            >
              <dt>{{ metric.label }}</dt>
              <dd>{{ metric.value }}</dd>
            </div>
          </dl>

          <p class="market-snapshot__status" aria-live="polite">
            <span :class="{ 'market-snapshot__status-dot--error': hasError }" />
            {{ hasError ? 'Market feed temporarily unavailable' : 'Nasdaq delayed market data' }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
