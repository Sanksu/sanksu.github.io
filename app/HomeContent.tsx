'use client'

import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { formatDate, postUrl } from '@/lib/format'
import type { PostsByYear, Post } from '@/lib/posts'

interface Props {
  postsByYear: PostsByYear
}

export default function HomeContent({ postsByYear }: Props) {
  const ref = useScrollAnimation()

  // 使用 flatMap + filter 简化 pinned posts 提取
  const pinnedPosts = Object.values(postsByYear)
    .flatMap(yearPosts => yearPosts)
    .filter(post => post.pinned)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="page page-index" ref={ref}>
      {pinnedPosts.length > 0 && (
        <div className="list-post">
          <h2>置顶</h2>
          <ul>
            {pinnedPosts.map(post => (
              <li key={post.slug} className="scroll-animate">
                <span className="date">{formatDate(post.date)}</span>
                <div className="title">
                  <Link href={postUrl(post)} className="hover-underline">{post.title}</Link>
                  <span className="pinned">置顶</span>
                </div>
                <div className="categories">
                  {post.categories.map(cat => (
                    <Link key={cat} href="/categories" className="hover-underline">{cat}</Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {Object.entries(postsByYear).sort((a, b) => Number(b[0]) - Number(a[0])).map(([year, yearPosts]) => {
        const unpinned = yearPosts.filter(p => !p.pinned)
        if (unpinned.length === 0) return null
        return (
          <div key={year} className="list-post">
            <h2 id={year}>{year}</h2>
            <ul>
              {unpinned.map(post => (
                <li key={post.slug} className="scroll-animate">
                  <span className="date">{formatDate(post.date)}</span>
                  <div className="title">
                    <Link href={postUrl(post)} className="hover-underline">{post.title}</Link>
                  </div>
                  <div className="categories">
                    {post.categories.map(cat => (
                      <Link key={cat} href="/categories" className="hover-underline">{cat}</Link>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
