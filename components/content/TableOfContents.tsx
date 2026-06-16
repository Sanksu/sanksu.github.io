'use client'

import { useEffect, useState, useMemo } from 'react'

/** 从 Markdown 提取的标题信息 */
interface Heading {
  id: string
  text: string
  level: number
}

/**
 * 生成 URL 友好的 slug
 * @param text - 原始文本
 * @returns 短横线连接的小写字符串
 */
function slugify(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, '-').toLowerCase()
}

/**
 * 剥离 Markdown 内联格式标记
 * 将 **bold**、*italic*、~~strikethrough~~ 等还原为纯文本
 * @param text - 原始 Markdown 文本
 * @returns 剥离格式后的纯文本
 */
function stripMarkdownFormatting(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
}

/**
 * 从 Markdown 内容提取 h1~h4 标题
 * @param markdown - 文章 Markdown 原始内容
 * @returns 标题数组，含 level / id / text
 */
function extractHeadings(markdown: string): Heading[] {
  const atxRegex = /^(#{1,4})\s+(.+)$/gm
  const result: Heading[] = []
  let match
  while ((match = atxRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const rawText = match[2].trim()
    if (rawText) {
      const cleanText = stripMarkdownFormatting(rawText)
      result.push({ level, id: slugify(cleanText), text: cleanText })
    }
  }
  return result
}

interface Props {
  /** 文章 Markdown 原始内容 */
  content: string
}

/**
 * 文章目录（TOC）组件
 * 从文章内容自动提取 h1~h4 标题生成侧边栏导航
 * - 使用 IntersectionObserver 高亮当前可见章节
 * - 标题数少于 2 时不显示（无需目录）
 */
export default function TableOfContents({ content }: Props) {
  const [activeId, setActiveId] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const headings = useMemo(() => {
    if (!content) return []
    return extractHeadings(content)
  }, [content])

  // 使用 IntersectionObserver 检测可见标题
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActiveId(e.target.id)
            break
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (!mounted || headings.length < 2) return null

  return (
    <nav className="toc" aria-label="目录">
      <span className="toc__title">目录</span>
      <ul>
        {headings.map(h => (
          <li key={h.id} className={`toc__item toc__item--${h.level} ${activeId === h.id ? 'toc__item--active' : ''}`}>
            <a href={h.level === 1 ? '#' : `#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
