'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function SearchContent({ allPosts }) {
  const ref = useScrollAnimation()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])

  function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '').replace(/[#*`\[\]]/g, '').replace(/\s+/g, '')
  }

  function escapeReg(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function search(key) {
    key = (key || '').trim()
    if (!key) {
      setResults([])
      return
    }

    const reg = new RegExp(escapeReg(key), 'gi')
    const filtered = allPosts
      .map(post => {
        const content = stripHtml(post.content)
        const match = reg.exec(content)
        const titleMatch = reg.test(post.title)

        if (!titleMatch && !match) return null

        let excerpt = ''
        if (match) {
          const idx = match.index
          const left = Math.max(0, idx - 10)
          const right = idx + 90
          excerpt = content.substring(left, right) + '...'
        }

        return {
          ...post,
          titleHighlight: titleMatch ? post.title.replace(new RegExp(escapeReg(key), 'gi'), `<span class="hint">${key}</span>`) : post.title,
          excerpt,
          excerptHighlight: excerpt
            ? excerpt.replace(new RegExp(escapeReg(key), 'gi'), `<span class="hint">${key}</span>`)
            : '',
        }
      })
      .filter(Boolean)

    setResults(filtered)
  }

  function postUrl(post) {
    const [y, m, d] = post.date.split('-')
    return `/posts/${y}/${m}/${d}/${post.slug}`
  }

  return (
    <div className="page page-search" ref={ref}>
      <input
        id="search-input"
        type="text"
        value={keyword}
        onChange={e => { setKeyword(e.target.value); search(e.target.value) }}
        placeholder="请在这里输入关键词^_^"
      />
      <h1>
        <span>搜索结果</span>
      </h1>
      <ul className="list-search">
        {results.map(r => (
          <li key={r.slug}>
            <Link href={postUrl(r)}>
              <p className="title" dangerouslySetInnerHTML={{ __html: r.titleHighlight }} />
              <p className="content" dangerouslySetInnerHTML={{ __html: r.excerptHighlight }} />
            </Link>
          </li>
        ))}
        {keyword && results.length === 0 && (
          <li>
            <p className="title">未找到相关结果</p>
          </li>
        )}
      </ul>
    </div>
  )
}
