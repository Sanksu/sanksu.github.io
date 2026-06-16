import Link from 'next/link'
import { postUrl } from '@/lib/format'
import type { Post } from '@/lib/posts'

interface Props {
  prevPost: Post | null
  nextPost: Post | null
}

export default function PostNavigation({ prevPost, nextPost }: Props) {
  if (!prevPost && !nextPost) return null

  return (
    <nav className="post-nav" aria-label="文章导航">
      {prevPost && (
        <Link href={postUrl(prevPost)} className="post-nav__item post-nav__prev">
          <span className="post-nav__label">上一篇</span>
          <span className="post-nav__title">{prevPost.title}</span>
        </Link>
      )}
      {nextPost && (
        <Link href={postUrl(nextPost)} className="post-nav__item post-nav__next">
          <span className="post-nav__label">下一篇</span>
          <span className="post-nav__title">{nextPost.title}</span>
        </Link>
      )}
    </nav>
  )
}
