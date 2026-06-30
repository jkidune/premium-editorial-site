<script setup lang="ts">
import {
  computed,
  ref,
  watch,
} from 'vue'
import { PortableText } from '@portabletext/vue'
import {
  RouterLink,
  useRoute,
} from 'vue-router'

import { fallbackNewsPosts } from '../data/newsFallback'
import { fetchPostBySlug } from '../lib/news'
import type { NewsPost } from '../types/news'

const route = useRoute()

const article = ref<NewsPost | null>(null)
const isLoading = ref(true)
const imageFailed = ref(false)

const articleDate = computed(() => {
  if (!article.value?.publishedAt) {
    return ''
  }

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(article.value.publishedAt))
})

const showImage = computed(() => {
  return Boolean(article.value?.imageUrl) && !imageFailed.value
})

function currentSlug() {
  const slug = route.params.slug

  return Array.isArray(slug)
    ? slug[0]
    : slug
}

async function loadArticle() {
  const slug = currentSlug()

  if (!slug) {
    article.value = null
    isLoading.value = false
    return
  }

  imageFailed.value = false
  isLoading.value = true

  const fallbackArticle =
    fallbackNewsPosts.find((post) => post.slug === slug) ?? null

  try {
    article.value =
      (await fetchPostBySlug(slug)) ?? fallbackArticle
  } catch (error) {
    console.error('Unable to load article.', error)
    article.value = fallbackArticle
  } finally {
    isLoading.value = false
  }
}

watch(
  () => route.params.slug,
  loadArticle,
  {
    immediate: true,
  },
)
</script>

<template>
  <main class="article-page">
    <div class="article-page__container">
      <RouterLink
        class="article-page__back-link"
        to="/journal"
      >
        <span aria-hidden="true">←</span>
        <span>All News</span>
      </RouterLink>

      <p v-if="isLoading" class="article-page__loading">
        Loading article…
      </p>

      <article
        v-else-if="article"
        class="article-page__article"
      >
        <div class="article-page__meta">
          <span>{{ articleDate }}</span>

          <span v-if="article.categories.length">
            {{ article.categories.join(' / ') }}
          </span>
        </div>

        <h1 class="article-page__title">
          {{ article.title }}
        </h1>

        <div class="article-page__image-wrapper">
          <img
            v-if="showImage"
            class="article-page__image"
            :src="article.imageUrl ?? undefined"
            :alt="article.imageAlt"
            @error="imageFailed = true"
          />

          <div
            v-else
            class="article-page__image-placeholder"
          />
        </div>

        <p
          v-if="article.excerpt"
          class="article-page__excerpt"
        >
          {{ article.excerpt }}
        </p>

        <PortableText
          v-if="article.body?.length"
          class="article-page__body"
          :value="article.body"
        />
      </article>

      <div
        v-else
        class="article-page__not-found"
      >
        <h1>Article Not Found</h1>

        <RouterLink to="/journal">
          Return to Journal
        </RouterLink>
      </div>
    </div>
  </main>
</template>
