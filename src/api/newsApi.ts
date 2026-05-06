import type { NewsItem } from '@/types/news'
import { apiFetch } from '@/lib/fetch'

const ENDPOINT = 'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest'
const SRC = 'CryptoCompare'

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
  const json = await apiFetch<{ Type: number; Data: CCArticle[] }>(ENDPOINT, SRC)
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
