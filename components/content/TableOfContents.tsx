'use client'

import { useEffect, useState, useMemo } from 'react'

interface Heading {
  id: string
  text: string
  level: number
}

function slugify(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, '-').toLowerCase()
}

function stripMarkdownFormatting(text: string): string {
  // 剥离 markdown 加粗、斜体、删除线标记，保留内部文本
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
}

function extractHeadings(markdown: string): Heading[] {
  // 匹配 Markdown ATX 式标题 (# ~ ####)
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
  content: string
}

export default function TableOfContents({ content }: Props) {
  const [activeId, setActiveId] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const headings = useMemo(() => {
    if (!content) return []
    return extractHeadings(content)
  }, [content])

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
