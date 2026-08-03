import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { slugFromFilename, stripHtml } from '../lib/utils'

/** 搜索索引条目 */
interface IndexEntry {
  slug: string
  title: string
  categories: string[]
  tags: string[]
  date: string
  content: string
}

/**
 * 生成搜索索引 JSON（Astro 构建时原生生成）
 * 替代独立脚本 + js-yaml，直接用 Content Collection
 * 输出路径：/search-index.json
 */
export const GET: APIRoute = async () => {
  const posts = await getCollection('posts')

  const entries: IndexEntry[] = posts.map(post => {
    const d = post.data.date
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    return {
      slug: slugFromFilename(post.id),
      title: post.data.title,
      categories: post.data.categories,
      tags: post.data.tags,
      date: dateStr,
      content: stripHtml(post.body),
    }
  })

  return new Response(JSON.stringify(entries), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
