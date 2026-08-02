import { getCollection, type CollectionEntry } from 'astro:content'
import { slugFromFilename, formatDateKey } from './utils'

/** 文章条目类型 */
export type Post = CollectionEntry<'posts'>

/** 按年份分组的文章集合 */
export interface PostsByYear {
  [year: string]: Post[]
}

/**
 * 获取所有已发布文章（排除草稿）
 * 按日期倒序排列
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft)
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

/**
 * 获取页面可见文章
 * dev 模式下包含草稿（便于预览），生产构建时排除草稿
 */
export async function getVisiblePosts(): Promise<Post[]> {
  const all = await getCollection('posts')
  const visible = import.meta.env.DEV ? all : all.filter(({ data }) => !data.draft)
  return visible.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

/** 按年份分组文章 */
export async function getPostsByYear(): Promise<PostsByYear> {
  const posts = await getVisiblePosts()
  const grouped: PostsByYear = {}
  for (const post of posts) {
    const year = String(post.data.date.getFullYear())
    if (!grouped[year]) grouped[year] = []
    grouped[year].push(post)
  }
  return grouped
}

/** 按分类分组文章 */
export async function getCategories(): Promise<Record<string, Post[]>> {
  const posts = await getVisiblePosts()
  const cats: Record<string, Post[]> = {}
  for (const post of posts) {
    for (const cat of post.data.categories) {
      if (!cats[cat]) cats[cat] = []
      cats[cat].push(post)
    }
  }
  return cats
}

/** 按标签分组文章 */
export async function getTags(): Promise<Record<string, Post[]>> {
  const posts = await getVisiblePosts()
  const tags: Record<string, Post[]> = {}
  for (const post of posts) {
    for (const tag of post.data.tags) {
      if (!tags[tag]) tags[tag] = []
      tags[tag].push(post)
    }
  }
  return tags
}

/** 根据 slug 查找文章（含草稿，供文章详情页在 dev 下预览草稿） */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getCollection('posts')
  return posts.find(p => slugFromFilename(p.id) === slug) ?? null
}

/**
 * 获取相邻文章（上一篇 / 下一篇，仅已发布）
 * 按日期倒序，上一篇 = 较旧的，下一篇 = 较新的
 */
export async function getAdjacentPosts(slug: string): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getVisiblePosts()
  const idx = posts.findIndex(p => slugFromFilename(p.id) === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  }
}

/** 生成文章 URL 路径 /posts/年/月/日/slug/ */
export function postUrl(post: Post): string {
  const d = post.data.date
  return `/posts/${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${encodeURIComponent(slugFromFilename(post.id))}/`
}

/** 获取文章的日期键 YYYY-MM-DD */
export function postDateKey(post: Post): string {
  return formatDateKey(post.data.date)
}
