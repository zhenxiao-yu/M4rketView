import { describe, it, expect } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'
import { fetchNews } from '@/api/newsApi'

const ALL_ORIGINS = 'https://api.allorigins.win/get'

const rss = (items: Array<{ title: string; link: string; pubDate: string; thumb?: string }>) => `<?xml version="1.0"?>
<rss xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    ${items
      .map(
        (i) => `<item>
      <title><![CDATA[${i.title}]]></title>
      <link>${i.link}</link>
      <pubDate>${i.pubDate}</pubDate>
      <description><![CDATA[<p>Story body about <b>${i.title}</b>&nbsp;&amp; more.</p>]]></description>
      <guid>${i.link}</guid>
      ${i.thumb ? `<media:thumbnail url="${i.thumb}"/>` : ''}
    </item>`,
      )
      .join('')}
  </channel>
</rss>`

describe('fetchNews', () => {
  it('parses RSS items, sorts by pubDate desc, strips HTML in descriptions', async () => {
    server.use(
      http.get(ALL_ORIGINS, () =>
        HttpResponse.json({
          contents: rss([
            {
              title: 'Older story',
              link: 'https://x/old',
              pubDate: 'Wed, 01 Jan 2025 12:00:00 GMT',
              thumb: 'https://img/old.jpg',
            },
            {
              title: 'Newer story',
              link: 'https://x/new',
              pubDate: 'Wed, 02 Jan 2025 12:00:00 GMT',
            },
          ]),
          status: { http_code: 200 },
        }),
      ),
    )

    const out = await fetchNews()
    expect(out.length).toBeGreaterThan(0)
    expect(out[0].title).toBe('Newer story')
    expect(out[0].description).not.toContain('<p>')
    expect(out[0].description).not.toContain('&amp;')
    expect(out[0].description).toContain('&')

    const withThumb = out.find((i) => i.title === 'Older story')
    expect(withThumb?.thumbnail).toBe('https://img/old.jpg')
  })

  it('throws when every feed fails (Promise.allSettled drops rejections, leaves no items)', async () => {
    server.use(
      http.get(ALL_ORIGINS, () => HttpResponse.json({ error: 'down' }, { status: 500 })),
    )
    await expect(fetchNews()).rejects.toThrow(/temporarily unavailable/)
  })

  it('continues when one feed fails but another succeeds', async () => {
    let call = 0
    server.use(
      http.get(ALL_ORIGINS, () => {
        call++
        if (call === 1) return HttpResponse.json({ error: 'down' }, { status: 500 })
        return HttpResponse.json({
          contents: rss([
            { title: 'Survivor', link: 'https://x/s', pubDate: 'Wed, 02 Jan 2025 12:00:00 GMT' },
          ]),
          status: { http_code: 200 },
        })
      }),
    )
    const out = await fetchNews()
    expect(out.some((i) => i.title === 'Survivor')).toBe(true)
  })
})
