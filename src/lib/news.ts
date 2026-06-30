import type { NewsPost } from '../types/news'

async function fetchNews<T>(parameters: URLSearchParams): Promise<T> {
  const response = await fetch(`/api/news?${parameters.toString()}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`News API returned ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function fetchLatestPosts(): Promise<NewsPost[]> {
  return fetchNews<NewsPost[]>(new URLSearchParams({ mode: 'latest' }))
}

export async function fetchAllPosts(): Promise<NewsPost[]> {
  return fetchNews<NewsPost[]>(new URLSearchParams({ mode: 'all' }))
}

export async function fetchPostBySlug(
  slug: string,
): Promise<NewsPost | null> {
  return fetchNews<NewsPost | null>(
    new URLSearchParams({ slug }),
  )
}
