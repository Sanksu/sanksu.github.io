import fs from 'fs'
import path from 'path'
import { getAllPosts } from './posts'
import { escapeXml } from './utils'
import { SITE_URL } from './data'

/**
 * 生成 XML Sitemap 文件
 * 包含静态页面（首页、分类、标签等）和所有文章页面的 URL
 * 在 `next build` 前通过 `tsx` 执行，输出到 `public/sitemap.xml`
 */
export function generateSitemap(): void {
  const posts = getAllPosts()
  const staticPages = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/categories/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/tags/`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/search/`, priority: '0.6', changefreq: 'monthly' },
    { loc: `${SITE_URL}/about/`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/links/`, priority: '0.6', changefreq: 'monthly' },
  ]

  const items = [
    ...staticPages.map(p => `  <url>
    <loc>${escapeXml(p.loc)}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`),
    ...posts.map(post => {
      const [y, m, d] = post.date.split('-')
      return `  <url>
    <loc>${escapeXml(SITE_URL)}/posts/${y}/${m}/${d}/${post.slug}/</loc>
    <lastmod>${post.date}</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>`
    })
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.join('\n')}
</urlset>
`

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap)
  console.log(`Sitemap generated`)
}
