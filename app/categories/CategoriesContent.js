'use client'

import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function CategoriesContent({ categories }) {
  const ref = useScrollAnimation()

  function formatDate(dateStr) {
    return dateStr.replace(/-/g, '/')
  }

  function postUrl(post) {
    const [y, m, d] = post.date.split('-')
    return `/posts/${y}/${m}/${d}/${post.slug}`
  }

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
          <h2 id={cat}>{cat}</h2>
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
