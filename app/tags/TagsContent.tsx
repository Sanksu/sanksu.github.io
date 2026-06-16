'use client'

import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { formatDate, postUrl } from '@/lib/format'
import type { Post } from '@/lib/posts'

/**
 * 标签页面内容组件
 * 顶部显示标签云，下方按标签分组展示文章
 */
export default function TagsContent({ tags }: { tags: Record<string, Post[]> }) {
  const ref = useScrollAnimation()

  const tagList = Object.keys(tags).sort((a, b) => a.localeCompare(b))

  return (
    <div className="page page-tags" ref={ref}>
      <div className="list-tag">
        <h2>所有标签</h2>
        <div className="tag-cloud">
          {tagList.map(tag => (
            <a key={tag} href={`#${tag}`}>{tag}</a>
          ))}
        </div>
      </div>
      {tagList.map(tag => (
        <div key={tag} className="list-post">
          <h2 id={tag}>
            <span className="tag-label">{tag}</span>
            <span className="tag-count">({tags[tag].length})</span>
          </h2>
          <ul>
            {tags[tag].map(post => (
              <li key={post.slug} className="scroll-animate">
                <span className="date">{formatDate(post.date)}</span>
                <div className="title">
                  <Link href={postUrl(post)} className="hover-underline">{post.title}</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {tagList.length === 0 && (
        <p style={{ color: 'var(--ark-text-dim)' }}>暂无标签</p>
      )}
    </div>
  )
}
