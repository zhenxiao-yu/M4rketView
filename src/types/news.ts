export type NewsSource = 'coindesk' | 'cointelegraph' | 'decrypt'

export interface NewsItem {
  guid: string
  title: string
  link: string
  pubDate: string
  thumbnail: string
  description: string
  author: string
  categories: string[]
  source: NewsSource
}
