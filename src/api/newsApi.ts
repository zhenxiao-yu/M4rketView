import type { NewsItem } from '@/types/news'
import { apiFetch } from '@/lib/fetch'

const PROXY = 'https://api.allorigins.win/get?url='

const FEEDS: { name: string; url: string }[] = [
  { name: 'CoinDesk',      url: 'https://www.coindesk.com/arc/outboundfeeds/rss' },
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
  { name: 'Decrypt',       url: 'https://decrypt.co/feed' },
]

interface AllOriginsResponse {
  contents: string
  status: { http_code: number }
}

const text = (item: Element, tag: string): string =>
  item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? ''

const stripHtml = (s: string): string =>
  s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
   .replace(/<[^>]*>/g, '')
   .replace(/&nbsp;/gi, ' ')
   .replace(/&amp;/gi, '&')
   .replace(/&quot;/gi, '"')
   .replace(/&#39;/gi, "'")
   .replace(/&[a-z]+;/gi, ' ')
   .replace(/\s+/g, ' ')
   .trim()

function extractThumbnail(item: Element): string {
  const mediaThumb = item.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
  if (mediaThumb) return mediaThumb
  const mediaContent = item.getElementsByTagName('media:content')[0]?.getAttribute('url')
  if (mediaContent) return mediaContent
  const enclosure = item.getElementsByTagName('enclosure')[0]?.getAttribute('url')
  if (enclosure) return enclosure
  const encoded = item.getElementsByTagName('content:encoded')[0]?.textContent ?? ''
  const imgMatch = encoded.match(/<img[^>]+src=["']([^"']+)["']/)
  return imgMatch?.[1] ?? ''
}

async function fetchFeed(name: string, url: string): Promise<NewsItem[]> {
  const res = await apiFetch<AllOriginsResponse>(`${PROXY}${encodeURIComponent(url)}`, name)
  if (!res.contents) return []
  const doc = new DOMParser().parseFromString(res.contents, 'text/xml')
  const items = Array.from(doc.getElementsByTagName('item'))
  return items.slice(0, 25).map((item, i): NewsItem => {
    const title = stripHtml(text(item, 'title'))
    const link = text(item, 'link')
    const rawDate = text(item, 'pubDate')
    const description = stripHtml(text(item, 'description')).substring(0, 220)
    return {
      guid: text(item, 'guid') || `${name}-${i}-${link}`,
      title,
      link,
      pubDate: rawDate ? new Date(rawDate).toISOString() : new Date().toISOString(),
      thumbnail: extractThumbnail(item),
      description,
      source: name,
    }
  })
}

export async function fetchNews(): Promise<NewsItem[]> {
  const results = await Promise.allSettled(FEEDS.map((f) => fetchFeed(f.name, f.url)))
  const items = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
  if (items.length === 0) {
    throw new Error('All news feeds are temporarily unavailable.')
  }
  return items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
}
