export type PortableTextBlock = {
  _type: string
  _key?: string
  [key: string]: unknown
}

export type NewsPost = {
  _id: string
  title: string
  slug: string
  categories: string[]
  imageUrl: string | null
  imageAlt: string
  excerpt: string
  publishedAt: string
  body?: PortableTextBlock[]
}
