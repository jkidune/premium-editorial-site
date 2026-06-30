<script setup lang="ts">
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import NewsCard from './NewsCard.vue'
import { useNewsPosts } from '../composables/useNewsPosts'

const sectionElement = ref<HTMLElement | null>(null)
const isRevealReady = ref(false)
const isRevealed = ref(false)

const { posts } = useNewsPosts('latest')

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
      threshold: 0.16,
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
    class="latest-news"
    :class="{
      'latest-news--reveal-ready': isRevealReady,
      'latest-news--revealed': isRevealed,
    }"
    aria-labelledby="latest-news-title"
  >
    <div class="latest-news__container">
      <header class="latest-news__header">
        <h2 id="latest-news-title" class="latest-news__heading">
          Latest News
        </h2>

        <RouterLink
          class="latest-news__view-all"
          to="/journal"
        >
          <span>View All</span>
          <span aria-hidden="true">↗</span>
        </RouterLink>
      </header>

      <div class="latest-news__grid">
        <NewsCard
          v-for="(post, index) in posts"
          :key="post._id"
          class="latest-news__card"
          :style="{ '--news-index': index }"
          :post="post"
        />
      </div>
    </div>
  </section>
</template>