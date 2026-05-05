import type { NewsItem, NewsSource } from '@/types/news'
import { RateLimitError } from '@/lib/errors'

const RSS2JSON = 'https://api.rss2json.com/v1/api.json'

const FEEDS: Record<NewsSource, string> = {
  coindesk:      'https://www.coindesk.com/arc/outboundfeeds/rss/',
  cointelegraph: 'https://cointelegraph.com/rss',
  decrypt:       'https://decrypt.co/feed',
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

export async function fetchNewsFeed(source: NewsSource): Promise<NewsItem[]> {
  const url = `${RSS2JSON}?rss_url=${encodeURIComponent(FEEDS[source])}&count=20`
  const res = await fetch(url)
  if (res.status === 429) throw new RateLimitError('RSS2JSON')
  if (!res.ok) throw new Error(`News fetch failed for ${source}`)
  const json = await res.json()
  if (json.status !== 'ok') throw new Error(`RSS2JSON error for ${source}`)

  return (json.items ?? []).map((item: Record<string, unknown>) => ({
    guid:        String(item.guid ?? item.link ?? ''),
    title:       String(item.title ?? '').trim(),
    link:        String(item.link ?? ''),
    pubDate:     String(item.pubDate ?? ''),
    thumbnail:   String(item.thumbnail ?? ''),
    description: stripHtml(String(item.description ?? '')).substring(0, 200),
    author:      String(item.author ?? ''),
    categories:  Array.isArray(item.categories) ? (item.categories as string[]) : [],
    source,
  }))
}
