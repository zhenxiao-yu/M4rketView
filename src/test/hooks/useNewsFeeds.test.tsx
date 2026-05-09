import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { useNewsFeeds } from '@/hooks/useNewsFeeds'
import { makeQueryWrapper } from '@/test/helpers/queryWrapper'

const ALL_ORIGINS = 'https://api.allorigins.win/get'

const rss = (items: { title: string; link: string; pubDate: string }[]) => `<?xml version="1.0"?>
<rss><channel>
  ${items
    .map(
      (i) => `<item>
    <title>${i.title}</title>
    <link>${i.link}</link>
    <pubDate>${i.pubDate}</pubDate>
    <description>desc</description>
    <guid>${i.link}</guid>
  </item>`,
    )
    .join('')}
</channel></rss>`

describe('useNewsFeeds', () => {
  it('aggregates feeds and de-duplicates by title', async () => {
    server.use(
      http.get(ALL_ORIGINS, () =>
        HttpResponse.json({
          contents: rss([
            { title: 'BTC ATH', link: 'https://x/1', pubDate: 'Wed, 01 Jan 2025 12:00:00 GMT' },
            { title: 'BTC ATH', link: 'https://x/2', pubDate: 'Wed, 01 Jan 2025 13:00:00 GMT' },
            { title: 'ETH news', link: 'https://x/3', pubDate: 'Wed, 01 Jan 2025 14:00:00 GMT' },
          ]),
          status: { http_code: 200 },
        }),
      ),
    )

    const { result } = renderHook(() => useNewsFeeds(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const titles = result.current.items.map((i) => i.title)
    expect(titles.filter((t) => t === 'BTC ATH').length).toBe(1)
    expect(titles).toContain('ETH news')
  })

  it('reports error when every feed fails', async () => {
    server.use(
      http.get(ALL_ORIGINS, () => HttpResponse.json({ error: 'down' }, { status: 500 })),
    )
    const { result } = renderHook(() => useNewsFeeds(), { wrapper: makeQueryWrapper() })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
