import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), '_posts')

function slugFromFilename(filename) {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

function getPostFiles() {
  return fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))
}

export function getAllPosts() {
  const files = getPostFiles()
  const posts = files.map(filename => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    let dateStr = data.date
    if (dateStr instanceof Date) {
      const y = dateStr.getFullYear()
      const m = String(dateStr.getMonth() + 1).padStart(2, '0')
      const d = String(dateStr.getDate()).padStart(2, '0')
      dateStr = `${y}-${m}-${d}`
    }
    dateStr = String(dateStr || '')

    return {
      title: data.title || '',
      date: dateStr,
      categories: data.categories || [],
      slug: slugFromFilename(filename),
      content,
    }
  })

  posts.sort((a, b) => b.date.localeCompare(a.date))
  return posts
}

export function getPostsByYear() {
  const posts = getAllPosts()
  const byYear = {}
  posts.forEach(post => {
    const year = post.date.split('-')[0]
    if (!byYear[year]) byYear[year] = []
    byYear[year].push(post)
  })
  return byYear
}

export function getCategories() {
  const posts = getAllPosts()
  const cats = {}
  posts.forEach(post => {
    post.categories.forEach(cat => {
      if (!cats[cat]) cats[cat] = []
      cats[cat].push(post)
    })
  })
  return cats
}

export function getPostBySlug(slug) {
  const posts = getAllPosts()
  return posts.find(p => p.slug === slug) || null
}

export function getAllPostSlugs() {
  const posts = getAllPosts()
  return posts.map(post => {
    const [year, month, day] = post.date.split('-')
    return { year, month, day, slug: post.slug }
  })
}
