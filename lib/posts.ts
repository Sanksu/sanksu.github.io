import fs from 'fs'
import path from 'path'
import { slugFromFilename, normalizeDate, parseFrontMatter } from './utils'

/**
 * 文章数据结构
 * 由 `parseFrontMatter` 解析 Markdown 文件的 YAML front-matter 和正文内容组装而成
 */
export interface Post {
  /** 文章标题 */
  title: string
  /** 发布日期，格式 YYYY-MM-DD */
  date: string
  /** 文章分类 */
  categories: string[]
  /** 文章标签 */
  tags: string[]
  /** 是否置顶 */
  pinned: boolean
  /** URL 友好的标识符，从文件名提取 */
  slug: string
  /** Markdown 原始正文 */
  content: string
}

/**
 * 文章路由参数
 * 用于 Next.js `generateStaticParams`
 */
export interface PostSlug {
  year: string
  month: string
  day: string
  slug: string
}

/** 按年份分组的文章集合 */
export interface PostsByYear {
  [year: string]: Post[]
}

/** `_posts` 目录的绝对路径 */
const postsDirectory = path.join(process.cwd(), '_posts')

/**
 * 获取所有 Markdown 文件名
 * @returns `_posts` 目录下的 `.md` 文件列表
 */
function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`)
    return []
  }
  return fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))
}

/** 全量文章缓存 */
let _allPostsCache: Post[] | null = null

/**
 * 获取所有文章
 * 解析 `_posts/` 下所有 `.md` 文件，按「置顶优先 → 日期倒序」排列
 * @returns 文章数组
 */
export function getAllPosts(): Post[] {
  if (_allPostsCache) return _allPostsCache

  const files = getPostFiles()
  const posts: Post[] = files.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = parseFrontMatter(fileContents)
    const dateStr = normalizeDate(data.date)

    const filenameSlug = slugFromFilename(filename)
    const title = String(data.title || '')

    return {
      title,
      date: dateStr,
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      pinned: data.pinned === true || data.pinned === 'true',
      slug: filenameSlug || title || 'untitled',
      content,
    }
  })

  posts.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.date.localeCompare(a.date)
  })
  _allPostsCache = posts
  return posts
}

/**
 * 按年份分组文章
 * @returns 以年份为键的文章分组对象
 */
export function getPostsByYear(): PostsByYear {
  const posts = getAllPosts()
  const sorted: PostsByYear = {}
  posts.forEach(post => {
    const year = post.date.split('-')[0]
    if (!sorted[year]) sorted[year] = []
    sorted[year].push(post)
  })
  return sorted
}

/**
 * 按分类分组文章
 * @returns 以分类名为键的文章分组对象
 */
export function getCategories(): Record<string, Post[]> {
  const posts = getAllPosts()
  const cats: Record<string, Post[]> = {}
  posts.forEach(post => {
    post.categories.forEach(cat => {
      if (!cats[cat]) cats[cat] = []
      cats[cat].push(post)
    })
  })
  return cats
}

/**
 * 按标签分组文章
 * @returns 以标签名为键的文章分组对象
 */
export function getTags(): Record<string, Post[]> {
  const posts = getAllPosts()
  const tags: Record<string, Post[]> = {}
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tags[tag]) tags[tag] = []
      tags[tag].push(post)
    })
  })
  return tags
}

/**
 * 根据 slug 查找文章
 * @param slug - 文章唯一标识
 * @returns 匹配的文章对象，未找到返回 `null`
 */
export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find(p => p.slug === slug) || null
}

/**
 * 获取相邻文章（上一篇 / 下一篇）
 * 按日期倒序排列，上一篇 = 较旧的，下一篇 = 较新的
 * @param slug - 当前文章标识
 * @returns 包含 prev 和 next 文章的对象
 */
export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts()
  const idx = posts.findIndex(p => p.slug === slug)
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  }
}

/**
 * 获取所有文章的路由参数
 * 用于 Next.js `generateStaticParams` 静态生成所有文章页面
 * 对含非 ASCII 字符的 slug 做 URL 编码，确保与浏览器端 URL 一致
 * @returns 包含 year、month、day、slug 的路由参数数组
 */
export function getAllPostSlugs(): PostSlug[] {
  return getAllPosts().map(post => {
    const [year, month, day] = post.date.split('-')
    return { year, month, day, slug: encodeURIComponent(post.slug) }
  })
}
