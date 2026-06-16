import SearchContent from './SearchContent'
import { getAllPosts } from '@/lib/posts'
import { getPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('search') as Metadata

export default function SearchPage() {
  const allPosts = getAllPosts().map(p => ({
    title: p.title,
    date: p.date,
    categories: p.categories,
    tags: p.tags,
    pinned: p.pinned,
    slug: p.slug,
    content: p.content,
  }))
  return <SearchContent allPosts={allPosts} />
}
