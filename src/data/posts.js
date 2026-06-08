// 新增文章只需在 _posts/ 中添加 .md 文件即可

// 简单的 front matter 解析器
function parseFrontMatter(raw) {
  const result = { title: '', date: '', categories: [], content: '' }

  // 检查是否有 front matter (--- 包裹)
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) {
    result.content = raw
    return result
  }

  const header = match[1]
  result.content = match[2].trimStart()

  // 解析每一行
  const lines = header.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    let value = trimmed.slice(colonIdx + 1).trim()

    if (!value) continue

    switch (key) {
      case 'title': {
        // 移除引号
        result.title = value.replace(/^['"]|['"]$/g, '')
        break
      }
      case 'date': {
        result.date = value.replace(/^['"]|['"]$/g, '')
        break
      }
      case 'categories': {
        // 支持 [cat1, cat2] 数组语法
        const arrMatch = value.match(/^\[([\s\S]*)\]$/)
        if (arrMatch) {
          result.categories = arrMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
        } else {
          // 单个值
          result.categories = [value.replace(/^['"]|['"]$/g, '')]
        }
        break
      }
    }
  }

  return result
}

function slugFromPath(path) {
  // path format: ../../_posts/2024-06-06-SlimeVR-BMI270.md
  // or /_posts/2024-06-06-SlimeVR-BMI270.md
  const filename = path.split('/').pop().replace('.md', '')
  // Remove date prefix (YYYY-MM-DD-)
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

// Vite 构建时导入所有 markdown 文件作为原始字符串
const mdModules = import.meta.glob('/_posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const posts = Object.entries(mdModules).map(([path, raw]) => {
  const fm = parseFrontMatter(raw)
  return {
    title: fm.title,
    date: fm.date,
    categories: fm.categories,
    slug: slugFromPath(path),
    content: fm.content,
  }
})

// 按日期降序排列（最新的在前）
posts.sort((a, b) => b.date.localeCompare(a.date))

// 获取所有分类及其文章
export function getCategories() {
  const catMap = {}
  posts.forEach(post => {
    post.categories.forEach(cat => {
      if (!catMap[cat]) catMap[cat] = []
      catMap[cat].push(post)
    })
  })
  return catMap
}

// 获取按年份分组的文章
export function getPostsByYear() {
  const yearMap = {}
  posts.forEach(post => {
    const year = post.date.slice(0, 4)
    if (!yearMap[year]) yearMap[year] = []
    yearMap[year].push(post)
  })
  return yearMap
}

// 根据 slug 查找文章
export function getPostBySlug(slug) {
  return posts.find(p => p.slug === slug) || null
}

// 获取所有文章（用于搜索）
export function getAllPosts() {
  return posts
}

export default posts
