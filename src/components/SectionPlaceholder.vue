<script setup lang="ts">
defineProps<{
  number: string
  title: string
  dark?: boolean
}>()
</script>

<template>
  <section
    class="editorial-placeholder"
    :class="{ 'editorial-placeholder--dark': dark }"
  >
    <div class="editorial-placeholder__topline">
      <span>({{ number }})</span>
      <span>Homepage Structure</span>
    </div>

    <h2 class="editorial-placeholder__title">
      {{ title }}
    </h2>

    <div class="editorial-placeholder__bottomline">
      <span>Content Pending</span>
      <span>{{ number }} / 07</span>
    </div>
  </section>
</template>