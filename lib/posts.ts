import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { slugFromFilename, normalizeDate, stripMarkdown } from './utils'

export interface Post {
  title: string
  date: string
  categories: string[]
  tags: string[]
  pinned: boolean
  slug: string
  content: string
}

export interface PostSlug {
  year: string
  month: string
  day: string
  slug: string
}

export interface PostsByYear {
  [year: string]: Post[]
}

const postsDirectory = path.join(process.cwd(), '_posts')

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`)
    return []
  }
  return fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))
}

let _allPostsCache: Post[] | null = null

export function getAllPosts(): Post[] {
  if (_allPostsCache) return _allPostsCache

  const files = getPostFiles()
  const posts: Post[] = files.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)
    const dateStr = normalizeDate(data.date)

    return {
      title: String(data.title || ''),
      date: dateStr,
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      pinned: data.pinned === true || data.pinned === 'true',
      slug: slugFromFilename(filename),
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

export function clearPostsCache(): void {
  _allPostsCache = null
}

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

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find(p => p.slug === slug) || null
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts()
  const idx = posts.findIndex(p => p.slug === slug)
  return {
    prev: idx < posts.length - 1 ? posts[idx + 1] : null,
    next: idx > 0 ? posts[idx - 1] : null,
  }
}

export function getPostExcerpt(content: string, maxLen = 160): string {
  const text = stripMarkdown(content).replace(/\s+/g, ' ').trim()
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
}

export function getAllPostSlugs(): PostSlug[] {
  return getAllPosts().map(post => {
    const [year, month, day] = post.date.split('-')
    return { year, month, day, slug: post.slug }
  })
}
