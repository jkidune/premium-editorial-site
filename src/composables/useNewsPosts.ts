import { onMounted, ref } from 'vue'
import { fallbackNewsPosts } from '../data/newsFallback'
import {
  fetchAllPosts,
  fetchLatestPosts,
} from '../lib/news'
import type { NewsPost } from '../types/news'

export function useNewsPosts(
  mode: 'latest' | 'all' = 'latest',
) {
  const fallbackPosts =
    mode === 'latest'
      ? fallbackNewsPosts.slice(0, 3)
      : fallbackNewsPosts

  const posts = ref<NewsPost[]>(fallbackPosts)
  const isLoading = ref(false)
  const hasCmsContent = ref(false)

  async function loadPosts() {
    isLoading.value = true

    try {
      const cmsPosts =
        mode === 'latest'
          ? await fetchLatestPosts()
          : await fetchAllPosts()

      if (cmsPosts.length > 0) {
        posts.value = cmsPosts
        hasCmsContent.value = true
      }
    } catch (error) {
      console.error('Unable to load CMS posts.', error)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(loadPosts)

  return {
    posts,
    isLoading,
    hasCmsContent,
    refreshPosts: loadPosts,
  }
}
