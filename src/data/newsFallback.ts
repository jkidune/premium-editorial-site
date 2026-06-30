import type { NewsPost } from '../types/news'

export const fallbackNewsPosts: NewsPost[] = [
  {
    _id: 'fallback-news-01',
    title: 'News Story Title Placeholder One',
    slug: 'news-story-placeholder-one',
    categories: ['News', 'Update'],
    imageUrl: '/images/news/news-01.png',
    imageAlt: 'News placeholder image one',
    excerpt:
      'A short summary of the first featured news story will appear here.',
    publishedAt: '2026-01-01T09:00:00Z',
    body: [],
  },
  {
    _id: 'fallback-news-02',
    title: 'News Story Title Placeholder Two',
    slug: 'news-story-placeholder-two',
    categories: ['Insights', 'Initiatives'],
    imageUrl: '/images/news/news-02.png',
    imageAlt: 'News placeholder image two',
    excerpt:
      'A short summary of the second featured news story will appear here.',
    publishedAt: '2025-12-18T09:00:00Z',
    body: [],
  },
  {
    _id: 'fallback-news-03',
    title: 'News Story Title Placeholder Three',
    slug: 'news-story-placeholder-three',
    categories: ['Events', 'Partnership'],
    imageUrl: '/images/news/news-03.png',
    imageAlt: 'News placeholder image three',
    excerpt:
      'A short summary of the third featured news story will appear here.',
    publishedAt: '2025-12-04T09:00:00Z',
    body: [],
  },
]
