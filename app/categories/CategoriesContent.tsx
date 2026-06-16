'use client'

import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { formatDate, postUrl } from '@/lib/format'
import type { Post } from '@/lib/posts'

/**
 * 分类页面内容组件
 * 顶部显示所有分类标签，下方按分类分组展示文章
 */
export default function CategoriesContent({ categories }: { categories: Record<string, Post[]> }) {
  const ref = useScrollAnimation()

  return (
    <div className="page page-categories" ref={ref}>
      <div className="list-category">
        <h2>所有分类</h2>
        <div>
          {Object.keys(categories).map(cat => (
            <a key={cat} href={`#${cat}`}>{cat}</a>
          ))}
        </div>
      </div>
      {Object.entries(categories).map(([cat, posts]) => (
        <div key={cat} className="list-post">
          <h2 id={cat}>{cat}<span className="tag-count">({posts.length})</span></h2>
          <ul>
            {posts.map(post => (
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
    </div>
  )
}
