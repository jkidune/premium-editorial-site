<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useSiteIntro } from '../composables/useSiteIntro'

const { isSiteReady } = useSiteIntro()

const navigationItems = [
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' },
]
</script>

<template>
  <header
    class="site-header"
    :class="{ 'site-header--ready': isSiteReady }"
  >
    <RouterLink class="site-header__brand" to="/" aria-label="Go to homepage">
      STUDIO / 01
    </RouterLink>

    <p class="site-header__descriptor">
      Independent Creative Practice
    </p>

    <nav class="site-header__navigation" aria-label="Main navigation">
      <RouterLink
        v-for="item in navigationItems"
        :key="item.to"
        :to="item.to"
        class="site-header__link"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>