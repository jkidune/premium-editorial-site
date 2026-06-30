<script setup lang="ts">
import AboutUsSection from '../components/AboutUsSection.vue'
import AnnualReportSection from '../components/AnnualReportSection.vue'
import HomeHero from '../components/HomeHero.vue'
import LatestNewsSection from '../components/LatestNewsSection.vue'
import MarketSnapshotSection from '../components/MarketSnapshotSection.vue'
import SectionPlaceholder from '../components/SectionPlaceholder.vue'
import WorkIntroSection from '../components/WorkIntroSection.vue'

const homepageSections = [
  { number: '07', title: 'Selected Work', dark: true },
  { number: '08', title: 'Capabilities', dark: false },
  { number: '09', title: 'Editorial', dark: true },
  { number: '10', title: 'Studio', dark: false },
  { number: '11', title: 'Contact', dark: true },
]
</script>

<template>
  <main>
    <HomeHero />

    <AboutUsSection />

    <WorkIntroSection />

    <AnnualReportSection />

    <MarketSnapshotSection />

    <LatestNewsSection />

    <SectionPlaceholder
      v-for="section in homepageSections"
      :key="section.number"
      :number="section.number"
      :title="section.title"
      :dark="section.dark"
    />
  </main>
</template>