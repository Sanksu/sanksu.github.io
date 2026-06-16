'use client'

import { useState, useEffect } from 'react'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { escapeHtml } from './utils'

const DANGEROUS_SCHEMES = /^(javascript|data|vbscript):/i

function safeAttr(str: string): string {
  return escapeHtml(str).replace(/"/g, '&quot;')
}

function isSafeSrc(src: string): boolean {
  return !DANGEROUS_SCHEMES.test(src.trim())
}

function slugify(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim().replace(/\s+/g, '-').toLowerCase()
}

// 创建 Marked 实例（单例模式，避免重复初始化）
let markedInstance: Marked | null = null

function getMarkedInstance(): Marked {
  if (!markedInstance) {
    markedInstance = new Marked({
      breaks: true,
      renderer: {
        image(hrefOrToken: string | { href?: string; text?: string }, _title: string | null, text: string) {
          const href = typeof hrefOrToken === 'string' ? hrefOrToken : (hrefOrToken?.href || '')
          const alt = typeof hrefOrToken === 'string' ? (text || '') : (hrefOrToken?.text || '')
          if (!isSafeSrc(href)) return ''
          return `<span class="img-container"><img src="${safeAttr(href)}" alt="${safeAttr(alt)}" loading="lazy" decoding="async" onload="this.style.opacity=1" style="opacity:0;transition:opacity .3s" /></span>`
        },
        heading(text: string, level: number) {
          const id = slugify(text)
          return `<h${level} id="${id}">${text}</h${level}>`
        },
      },
    })

    markedInstance.use(
      markedHighlight({
        emptyLangClass: 'hljs',
        langPrefix: 'hljs language-',
        highlight(code: string, lang: string) {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          return hljs.highlight(code, { language }).value
        }
      })
    )
  }

  return markedInstance
}

interface Props {
  content: string
}

export default function MarkedRenderer({ content }: Props) {
  const [renderedContent, setRenderedContent] = useState('')

  useEffect(() => {
    if (!content) return

    // 使用 requestAnimationFrame 确保 DOM 已就绪
    const rafId = requestAnimationFrame(() => {
      const marked = getMarkedInstance()
      setRenderedContent(marked.parse(content) as string)
    })

    return () => cancelAnimationFrame(rafId)
  }, [content])

  if (!renderedContent) {
    return (
      <div className="post post-content">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ark-text-dim)' }}>
          正在渲染内容...
        </div>
      </div>
    )
  }

  return (
    <div
      className="post scroll-animate post-content"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}
