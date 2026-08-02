/**
 * 生成搜索索引文件
 * 构建前执行，输出到 public/search-index.json
 * 包含每篇已发布文章的 slug、标题、分类、标签、日期和正文纯文本
 */
import fs from 'fs'
import path from 'path'
import { glob } from 'astro/loaders'
import { stripHtml } from '../src/lib/utils'
import { load as loadYaml } from 'js-yaml'

interface IndexEntry {
  slug: string
  title: string
  categories: string[]
  tags: string[]
  date: string
  content: string
}

/**
 * 从 Markdown 文件解析 front-matter 与正文
 */
function parseFrontMatter(fileContents: string): { data: Record<string, any>; content: string } {
  const startMatch = fileContents.match(/^---\r?\n/)
  if (!startMatch) return { data: {}, content: fileContents }

  const startOffset = startMatch[0].length
  const closeMatch = fileContents.slice(startOffset).match(/\r?\n---\s*\r?\n/)
  if (!closeMatch) return { data: {}, content: fileContents.slice(startOffset) }

  const endIndex = startOffset + closeMatch.index!
  const yamlStr = fileContents.slice(startOffset, endIndex)
  const content = fileContents.slice(endIndex + closeMatch[0].length)

  try {
    return { data: (loadYaml(yamlStr) as Record<string, any>) ?? {}, content }
  } catch {
    return { data: {}, content }
  }
}

/**
 * 从文件名提取 slug（去除日期前缀和 .md 后缀）
 */
function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-?/, '')
}

function main() {
  const postsDir = path.join(process.cwd(), 'src', 'content', 'posts')
  if (!fs.existsSync(postsDir)) {
    console.warn('Posts directory not found, skipping search index generation')
    return
  }

  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'))
  const entries: IndexEntry[] = []

  for (const filename of files) {
    const filePath = path.join(postsDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = parseFrontMatter(fileContents)

    const dateStr = data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : String(data.date || '')

    entries.push({
      slug: slugFromFilename(filename),
      title: String(data.title || ''),
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      date: dateStr,
      content: stripHtml(content),
    })
  }

  const outPath = path.join(process.cwd(), 'public', 'search-index.json')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, JSON.stringify(entries), 'utf8')
  console.log(`Search index generated: ${outPath} (${entries.length} articles)`)
}

main()
