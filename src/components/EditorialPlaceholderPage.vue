<script setup lang="ts">
defineProps<{
  number: string
  title: string
}>()
</script>

<template>
  <main class="interior-page">
    <section class="interior-page__section">
      <div class="interior-page__topline">
        <span>({{ number }})</span>
        <span>Page Structure</span>
      </div>

      <h1 class="interior-page__title">
        {{ title }}
      </h1>

      <div class="interior-page__bottomline">
        <span>Content Pending</span>
        <span>Studio / 01</span>
      </div>
    </section>
  </main>
</template>