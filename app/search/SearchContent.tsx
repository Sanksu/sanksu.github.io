'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { postUrl } from '@/lib/format'
import { escapeHtml, stripHtml, escapeReg } from '@/lib/utils'
import type { Post } from '@/lib/posts'

interface SearchPost extends Post {
  titleHighlight?: string
  excerpt?: string
  excerptHighlight?: string
}

function useDebounce(value: string, delay = 300): string {
  const [debounced, setDebounced] = useState(value)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setDebounced(value), delay)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [value, delay])

  return debounced
}

interface Props {
  allPosts: Post[]
}

export default function SearchContent({ allPosts }: Props) {
  const ref = useScrollAnimation()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<SearchPost[]>([])
  const debouncedKeyword = useDebounce(keyword)

  const search = useCallback((key: string) => {
    key = key.trim()
    if (!key) { setResults([]); return }

    const reg = new RegExp(escapeReg(key), 'gi')
    const filtered = allPosts
      .map(post => {
        const content = stripHtml(post.content || '')
        const match = reg.exec(content)
        reg.lastIndex = 0
        const titleMatch = reg.test(post.title || '')

        if (!titleMatch && !match) return null

        let excerpt = ''
        if (match && match.index !== undefined) {
          const idx = match.index
          const left = Math.max(0, idx - 10)
          const right = idx + 90
          excerpt = content.substring(left, right) + '...'
        }

        const escaped = escapeHtml(key)
        const highlightReg = new RegExp(escapeReg(key), 'gi')

        // 先转义全文为安全文本，再做关键词高亮替换
        const safeTitle = escapeHtml(post.title || '')
        const safeExcerpt = escapeHtml(excerpt)

        return {
          ...post,
          titleHighlight: titleMatch ? safeTitle.replace(highlightReg, `<span class="hint">${escaped}</span>`) : escaped,
          excerpt,
          excerptHighlight: safeExcerpt ? safeExcerpt.replace(highlightReg, `<span class="hint">${escaped}</span>`) : '',
        }
      })
      .filter(Boolean) as SearchPost[]

    setResults(filtered)
  }, [allPosts])

  useEffect(() => { search(debouncedKeyword) }, [debouncedKeyword, search])

  return (
    <div className="page page-search" ref={ref}>
      <input
        id="search-input"
        type="text"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="请在这里输入关键词^_^"
      />
      <h1><span>搜索结果</span></h1>
      <ul className="list-search">
        {results.map(r => (
          <li key={r.slug}>
            <Link href={postUrl(r)}>
              <p className="title" dangerouslySetInnerHTML={{ __html: r.titleHighlight! }} />
              <p className="content" dangerouslySetInnerHTML={{ __html: r.excerptHighlight! }} />
            </Link>
          </li>
        ))}
        {keyword && results.length === 0 && (
          <li><p className="title">未找到相关结果</p></li>
        )}
      </ul>
    </div>
  )
}
