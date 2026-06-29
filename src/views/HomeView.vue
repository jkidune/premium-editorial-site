<script setup lang="ts">
import HomeHero from '../components/HomeHero.vue'
import SectionPlaceholder from '../components/SectionPlaceholder.vue'

const homepageSections = [
  { number: '02', title: 'Introduction', dark: false },
  { number: '03', title: 'Selected Work', dark: true },
  { number: '04', title: 'Capabilities', dark: false },
  { number: '05', title: 'Editorial', dark: true },
  { number: '06', title: 'Studio', dark: false },
  { number: '07', title: 'Contact', dark: true },
]
</script>

<template>
  <main>
    <HomeHero />

    <SectionPlaceholder
      v-for="section in homepageSections"
      :key="section.number"
      :number="section.number"
      :title="section.title"
      :dark="section.dark"
    />
  </main>
</template>