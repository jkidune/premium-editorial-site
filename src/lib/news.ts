import { sanityClient } from './sanity'
import type { NewsPost } from '../types/news'

const postFields = `
  _id,
  title,
  "slug": slug.current,
  "categories": coalesce(categories, []),
  "imageUrl": featuredImage.asset->url,
  "imageAlt": coalesce(featuredImage.alt, title),
  "excerpt": coalesce(excerpt, ""),
  publishedAt,
  body
`

const latestPostsQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    coalesce(isPublished, true) == true
  ]
  | order(publishedAt desc)[0...3] {
    ${postFields}
  }
`

const allPostsQuery = `
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    coalesce(isPublished, true) == true
  ]
  | order(publishedAt desc) {
    ${postFields}
  }
`

const postBySlugQuery = `
  *[
    _type == "post" &&
    slug.current == $slug &&
    coalesce(isPublished, true) == true
  ][0] {
    ${postFields}
  }
`

export async function fetchLatestPosts(): Promise<NewsPost[]> {
  if (!sanityClient) {
    return []
  }

  return sanityClient.fetch<NewsPost[]>(latestPostsQuery)
}

export async function fetchAllPosts(): Promise<NewsPost[]> {
  if (!sanityClient) {
    return []
  }

  return sanityClient.fetch<NewsPost[]>(allPostsQuery)
}

export async function fetchPostBySlug(
  slug: string,
): Promise<NewsPost | null> {
  if (!sanityClient) {
    return null
  }

  return sanityClient.fetch<NewsPost | null>(
    postBySlugQuery,
    { slug },
  )
}