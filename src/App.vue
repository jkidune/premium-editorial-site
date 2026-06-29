<script setup lang="ts">
type Section = {
  id: string
  label: string
  number: string
  heading: 'h1' | 'h2'
  theme: 'light' | 'dark'
}

const sections: Section[] = [
  {
    id: 'hero',
    label: 'Hero',
    number: '01',
    heading: 'h1',
    theme: 'dark',
  },
  {
    id: 'introduction',
    label: 'Introduction',
    number: '02',
    heading: 'h2',
    theme: 'light',
  },
  {
    id: 'selected-work',
    label: 'Selected Work',
    number: '03',
    heading: 'h2',
    theme: 'dark',
  },
  {
    id: 'capabilities',
    label: 'Capabilities',
    number: '04',
    heading: 'h2',
    theme: 'light',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    number: '05',
    heading: 'h2',
    theme: 'dark',
  },
  {
    id: 'studio',
    label: 'Studio',
    number: '06',
    heading: 'h2',
    theme: 'light',
  },
  {
    id: 'contact',
    label: 'Contact',
    number: '07',
    heading: 'h2',
    theme: 'dark',
  },
]
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="site-header__brand" href="#hero" aria-label="Back to top">
        STUDIO
      </a>

      <p class="site-header__meta">Independent Creative Practice</p>

      <a class="site-header__index" href="#contact">
        Index <span aria-hidden="true">↘</span>
      </a>
    </header>

    <main>
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="editorial-section"
        :class="`editorial-section--${section.theme}`"
        :aria-labelledby="`${section.id}-title`"
      >
        <div class="editorial-section__topline">
          <span class="editorial-section__number">({{ section.number }})</span>

          <span class="editorial-section__status">
            Frontend Structure
          </span>
        </div>

        <component
          :is="section.heading"
          :id="`${section.id}-title`"
          class="editorial-section__title"
        >
          {{ section.label }}
        </component>

        <div class="editorial-section__bottomline">
          <span>Placeholder</span>
          <span>{{ section.number }} / 07</span>
        </div>
      </section>
    </main>
  </div>
</template>