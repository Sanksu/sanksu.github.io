'use client'

import Link from 'next/link'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function HomeContent({ postsByYear }) {
  const ref = useScrollAnimation()

  function formatDate(dateStr) {
    return dateStr.replace(/-/g, '/')
  }

  function postUrl(post) {
    const [y, m, d] = post.date.split('-')
    return `/posts/${y}/${m}/${d}/${post.slug}`
  }

  return (
    <div className="page page-index" ref={ref}>
      {Object.entries(postsByYear).map(([year, yearPosts]) => (
        <div key={year} className="list-post">
          <h2 id={year}>{year}</h2>
          <ul>
            {yearPosts.map(post => (
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
      ))}
    </div>
  )
}
