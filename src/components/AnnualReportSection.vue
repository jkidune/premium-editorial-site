<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import DocumentCard from './DocumentCard.vue'

const sectionElement = ref<HTMLElement | null>(null)

const isRevealReady = ref(false)
const isRevealed = ref(false)

const report = {
  year: '2025',
  title: 'Annual Report',
  description:
    'Our 2025 Annual Report provides a comprehensive overview of our company’s performance, strategic progress, and key achievements over the past year.',
  image: '/images/annual-report/annual-report-2025-cover.png',
  document: '/documents/annual-report-2025.pdf',
}

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
    class="annual-report"
    :class="{
      'annual-report--reveal-ready': isRevealReady,
      'annual-report--revealed': isRevealed,
    }"
    aria-labelledby="annual-report-title"
  >
    <div class="annual-report__container">
      <div class="annual-report__panel">
        <div
          class="annual-report__image-wrapper"
          role="img"
          aria-label="2025 Annual Report cover image"
        >
          <div
            class="annual-report__image"
            :style="{
              backgroundImage: `url(${report.image})`,
            }"
          />
        </div>

        <div class="annual-report__content">
          <h2 id="annual-report-title" class="annual-report__title">
            <span class="annual-report__title-line">
              {{ report.year }}
            </span>

            <span class="annual-report__title-line">
              {{ report.title }}
            </span>
          </h2>

          <div class="annual-report__bottom">
            <p class="annual-report__description">
              {{ report.description }}
            </p>

            <DocumentCard
              :href="report.document"
              title="Read the Report"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>