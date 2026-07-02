import fs from 'fs'

import path from 'path'
import { getPublishedPosts } from './posts'
import { escapeXml, stripHtml } from './utils'
import { postUrl } from './format'
import { getSiteUrl, getSiteName } from './metadata'

/**
 * 将 YYYY-MM-DD 转为 RFC-822 格式（RSS 规范要求）
 * @param dateStr - YYYY-MM-DD 格式日期
 * @returns RFC 822 时间字符串（如 `Thu, 06 Jun 2024 00:00:00 GMT`）
 */
function formatRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString()
}

/**
 * 生成 RSS 2.0 XML 文件
 * 在 `next build` 前通过 `tsx` 执行，输出到 `public/rss.xml`
 */
export function generateRss(): void {
  const siteUrl = getSiteUrl()
  const siteName = getSiteName()
  const posts = getPublishedPosts()
  const items = posts.map(post => {
    const link = `${siteUrl}${postUrl(post)}/`
    const desc = stripHtml(post.content).slice(0, 300)
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${formatRfc822(post.date)}</pubDate>
      <description>${escapeXml(desc)}</description>${post.categories.map(c => `\n      <category>${escapeXml(c)}</category>`).join('')}
    </item>`
  }).join('\n')

  const lastBuildDate = posts.length > 0 ? formatRfc822(posts[0].date) : new Date().toUTCString()

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}/</link>
    <description>${escapeXml(siteName)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  const outPath = path.join(process.cwd(), 'public', 'rss.xml')
  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`RSS generated: ${outPath} (${posts.length} articles)`)
}
