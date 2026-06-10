'use client'

import { useEffect } from 'react'
import { marked } from 'marked'
import WalineComments from '@/components/WalineComments'
import ImagePreview from '@/components/ImagePreview'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function PostContent({ post, postPath }) {
  const ref = useScrollAnimation()

  useEffect(() => {
    if (!post) return

    const tables = document.querySelectorAll('.post-content table')
    tables.forEach(table => {
      if (!table.parentNode.classList.contains('table-container')) {
        const wrap = document.createElement('div')
        wrap.className = 'table-container'
        table.parentNode.insertBefore(wrap, table)
        wrap.appendChild(table)
      }
    })

    document.querySelectorAll('.post-content h1, .post-content h2').forEach(el => {
      el.addEventListener('click', function () {
        this.scrollIntoView({ block: 'start' })
        if (this.id && history.replaceState) {
          history.replaceState({}, '', '#' + this.id)
        }
      })
    })
  }, [post])

  if (!post) {
    return (
      <div className="page page-post">
        <h1 className="title">文章未找到</h1>
      </div>
    )
  }

  const renderedContent = marked(post.content, { breaks: true })

  return (
    <div ref={ref}>
      <div className="page page-post">
        <h1 className="title scroll-animate">{post.title}</h1>
        <div className="subtitle scroll-animate">
          <span>Sanksu 于 {post.date} 发布</span>
          <span> | 阅读量: <span className="waline-pageview-count" data-path={postPath} /></span>
        </div>
        <div
          className="post scroll-animate post-content"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
        <WalineComments serverURL="https://waline.sanksu.cn/" path={postPath} />
      </div>
      <ImagePreview />
    </div>
  )
}
