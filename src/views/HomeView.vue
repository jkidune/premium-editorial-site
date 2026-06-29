<script setup lang="ts">
import AboutUsSection from '../components/AboutUsSection.vue'
import HomeHero from '../components/HomeHero.vue'
import SectionPlaceholder from '../components/SectionPlaceholder.vue'
import WorkIntroSection from '../components/WorkIntroSection.vue'

const homepageSections = [
  { number: '04', title: 'Selected Work', dark: true },
  { number: '05', title: 'Capabilities', dark: false },
  { number: '06', title: 'Editorial', dark: true },
  { number: '07', title: 'Studio', dark: false },
  { number: '08', title: 'Contact', dark: true },
]
</script>

<template>
  <main>
    <HomeHero />

    <AboutUsSection />

    <WorkIntroSection />

    <SectionPlaceholder
      v-for="section in homepageSections"
      :key="section.number"
      :number="section.number"
      :title="section.title"
      :dark="section.dark"
    />
  </main>
</template>