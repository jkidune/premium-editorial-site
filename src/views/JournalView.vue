<script setup lang="ts">
import NewsCard from '../components/NewsCard.vue'
import { useNewsPosts } from '../composables/useNewsPosts'

const { posts } = useNewsPosts('all')
</script>

<template>
  <main class="journal-page">
    <section class="journal-page__hero">
      <div class="journal-page__container">
        <p class="journal-page__eyebrow">
          Studio / Journal
        </p>

        <h1 class="journal-page__title">
          Latest News
        </h1>
      </div>
    </section>

    <section class="journal-page__content">
      <div class="journal-page__container">
        <div class="journal-page__grid">
          <NewsCard
            v-for="post in posts"
            :key="post._id"
            :post="post"
          />
        </div>
      </div>
    </section>
  </main>
</template>