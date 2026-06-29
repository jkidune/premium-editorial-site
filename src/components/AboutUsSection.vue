<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import EditorialButton from './EditorialButton.vue'

const sectionElement = ref<HTMLElement | null>(null)
const isRevealReady = ref(false)
const isRevealed = ref(false)

const statementWords = [
  'We',
  'create',
  'thoughtful',
  'digital',
  'experiences,',
  'shape',
  'distinctive',
  'brands,',
  'and',
  'build',
  'work',
  'that',
  'feels',
  'clear,',
  'useful,',
  'and',
  'lasting.',
  'Grounded',
  'in',
  'craft',
  'and',
  'driven',
  'by',
  'curiosity,',
  'we',
  'move',
  'with',
  'purpose.',
]

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
      if (!entry || !entry.isIntersecting) {
        return
      }

      isRevealed.value = true
      observer?.disconnect()
    },
    {
      threshold: 0.22,
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
    class="about-us-section"
    :class="{
      'about-us-section--reveal-ready': isRevealReady,
      'about-us-section--revealed': isRevealed,
    }"
    aria-labelledby="about-us-title"
  >
    <h2 id="about-us-title" class="sr-only">
      About Us
    </h2>

    <div class="about-us-section__content">
      <p
        class="about-us-section__statement"
        aria-label="We create thoughtful digital experiences, shape distinctive brands, and build work that feels clear, useful, and lasting. Grounded in craft and driven by curiosity, we move with purpose."
      >
        <span
          v-for="(word, index) in statementWords"
          :key="`${word}-${index}`"
          class="about-us-section__word"
          :style="{ '--word-index': index }"
        >
          {{ word }}
        </span>
      </p>

     <div class="about-us-section__cta-reveal">
  <EditorialButton to="/about">
    Explore Our Studio
  </EditorialButton>
</div>
    </div>
  </section>
</template>