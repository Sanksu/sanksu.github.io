'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import WalineComments from '@/components/features/WalineComments'
import ImagePreview from '@/components/ui/ImagePreview'
import TableOfContents from '@/components/content/TableOfContents'
import PostNavigation from '@/components/content/PostNavigation'
import CodeBlockEnhance from '@/components/content/CodeBlockEnhance'
import ReadingProgress from '@/components/ui/ReadingProgress'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { getReadingTime } from '@/lib/format'
import type { Post } from '@/lib/posts'

// 动态加载大型依赖，减少首屏体积
const MarkedRenderer = dynamic(
  () => import('@/lib/marked-renderer').then(mod => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="post post-content">
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--ark-text-dim)' }}>
          正在渲染内容...
        </div>
      </div>
    )
  }
)

interface Props {
  post: Post | null
  postPath: string
  prevPost: Post | null
  nextPost: Post | null
  walineConfig: { serverURL: string; emoji: string[] }
}

export default function PostContent({ post, postPath, prevPost, nextPost, walineConfig }: Props) {
  const ref = useScrollAnimation()

  const readingTime = useMemo(() => {
    if (!post) return 0
    return getReadingTime(post.content)
  }, [post])

  const handleHeadingClick = useCallback((e: Event) => {
    const el = e.currentTarget as HTMLElement
    el.scrollIntoView({ block: 'start' })
    if (el.id && history.replaceState) {
      history.replaceState({}, '', '#' + el.id)
    }
  }, [])

  useEffect(() => {
    if (!post) return

    // 用 MutationObserver 监听 .post-content 渲染完成，替代不可靠的 setTimeout
    const target = document.querySelector('.post-content')
    if (!target) return

    let done = false
    const enhance = () => {
      if (done) return
      done = true

      const tables = target.querySelectorAll('table')
      tables.forEach(table => {
        if (!table.parentNode || (table.parentNode as HTMLElement).classList?.contains('table-container')) return
        const wrap = document.createElement('div')
        wrap.className = 'table-container'
        table.parentNode.insertBefore(wrap, table)
        wrap.appendChild(table)
      })

      const headings = target.querySelectorAll('h1, h2')
      headings.forEach(el => {
        el.addEventListener('click', handleHeadingClick)
      })
    }

    // 如果内容已存在（非首次渲染），直接执行
    if (target.children.length > 0) {
      enhance()
      return
    }

    // 否则监听内容插入
    const observer = new MutationObserver((mutations, obs) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if (node.nodeType === 1 && (node as Element).querySelector) {
            enhance()
            obs.disconnect()
            return
          }
        }
      }
    })

    observer.observe(target, { childList: true })

    return () => {
      observer.disconnect()
      const headings = target.querySelectorAll('h1, h2')
      headings.forEach(el => {
        el.removeEventListener('click', handleHeadingClick)
      })
    }
  }, [post, handleHeadingClick])

  if (!post) {
    return (
      <div className="page page-post">
        <h1 className="title">文章未找到</h1>
      </div>
    )
  }

  return (
    <div ref={ref}>
      <ReadingProgress />
      <div className="page-layout">
        <div className="page page-post">
          <h1 className="title scroll-animate">{post.title}</h1>
          <div className="subtitle scroll-animate">
            <span>Sanksu 于 {post.date} 发布</span>
            <span> | 阅读时长: {readingTime} 分钟</span>
            <span> | 阅读量: <span className="waline-pageview-count" data-path={postPath} /></span>
          </div>
          <MarkedRenderer content={post.content} />
          <CodeBlockEnhance />
          <PostNavigation prevPost={prevPost} nextPost={nextPost} />
          <WalineComments serverURL={walineConfig.serverURL} path={postPath} emoji={walineConfig.emoji} />
        </div>
        <TableOfContents content={post.content} />
      </div>
      <ImagePreview />
    </div>
  )
}
