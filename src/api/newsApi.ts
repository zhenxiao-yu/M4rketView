import type { NewsItem } from '@/types/news'
import { RateLimitError } from '@/lib/errors'

const ENDPOINT = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest'

interface CCArticle {
  id: string
  published_on: number
  imageurl: string
  title: string
  url: string
  source: string
  body: string
  source_info: { name: string }
}

export async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(ENDPOINT)
  if (res.status === 429) throw new RateLimitError('CryptoCompare')
  if (!res.ok) throw new Error('News fetch failed')
  const json = await res.json() as { Type: number; Data: CCArticle[] }
  return (json.Data ?? []).map((a) => ({
    guid: a.id,
    title: a.title,
    link: a.url,
    pubDate: new Date(a.published_on * 1000).toISOString(),
    thumbnail: a.imageurl ?? '',
    description: a.body.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim().substring(0, 220),
    source: a.source_info?.name ?? a.source,
  }))
}
