import fs from 'fs'
import path from 'path'
import { getAllPosts } from './posts'
import { escapeXml, stripMarkdown } from './utils'
import { SITE_URL } from './data'

function formatRfc822(dateStr: string): string {
  return new Date(dateStr).toUTCString()
}

export function generateRss(): void {
  const posts = getAllPosts()
  const items = posts.map(post => {
    const [y, m, d] = post.date.split('-')
    const link = `${SITE_URL}/posts/${y}/${m}/${d}/${post.slug}/`
    const desc = stripMarkdown(post.content).replace(/\s+/g, ' ').trim().slice(0, 300)
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${formatRfc822(post.date)}</pubDate>
      <description>${escapeXml(desc)}</description>${post.categories.map(c => `\n      <category>${escapeXml(c)}</category>`).join('')}
    </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sanksu Blog</title>
    <link>${SITE_URL}/</link>
    <description>Sanksu的个人博客</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  const outPath = path.join(process.cwd(), 'public', 'rss.xml')
  fs.writeFileSync(outPath, xml, 'utf8')
  console.log(`RSS generated: ${outPath} (${posts.length} articles)`)
}
