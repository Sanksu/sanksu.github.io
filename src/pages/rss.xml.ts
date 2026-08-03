import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getPublishedPosts, postUrl } from '../lib/posts'
import { getSiteUrl, getSiteName } from '../data/site'
import { stripHtml } from '../lib/utils'

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts()
  const siteUrl = getSiteUrl()

  return rss({
    title: getSiteName(),
    description: 'Sanksu的个人博客',
    site: context.site ?? siteUrl,
    xmlns: { atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>zh-cn</language><atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>`,
    items: posts.map(post => ({
      title: post.data.title,
      link: `${siteUrl}${postUrl(post)}`,
      pubDate: post.data.date,
      categories: post.data.categories,
      description: stripHtml(post.body).slice(0, 300),
    })),
  })
}
