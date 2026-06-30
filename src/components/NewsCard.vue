<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import type { NewsPost } from '../types/news'

const props = defineProps<{
  post: NewsPost
}>()

const imageFailed = ref(false)

const showImage = computed(() => {
  return Boolean(props.post.imageUrl) && !imageFailed.value
})

function handleImageError() {
  imageFailed.value = true
}
</script>

<template>
  <RouterLink
    class="news-card"
    :to="{
      name: 'article',
      params: {
        slug: post.slug,
      },
    }"
  >
    <article>
      <div class="news-card__image-wrapper">
        <img
          v-if="showImage"
          class="news-card__image"
          :src="post.imageUrl ?? undefined"
          :alt="post.imageAlt"
          loading="lazy"
          @error="handleImageError"
        />

        <div
          v-else
          class="news-card__image-placeholder"
          aria-hidden="true"
        >
          <span>Image Placeholder</span>
        </div>
      </div>

      <ul
        v-if="post.categories.length"
        class="news-card__categories"
        aria-label="Article categories"
      >
        <li
          v-for="category in post.categories.slice(0, 4)"
          :key="category"
        >
          {{ category }}
        </li>
      </ul>

      <div class="news-card__footer">
        <h3 class="news-card__title">
          {{ post.title }}
        </h3>

        <span class="news-card__arrow" aria-hidden="true">
          ↗
        </span>
      </div>
    </article>
  </RouterLink>
</template>