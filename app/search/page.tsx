import SearchContent from './SearchContent'
import { getVisiblePosts } from '@/lib/posts'
import { getPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('search') as Metadata

export default function SearchPage() {
  return <SearchContent allPosts={getVisiblePosts()} />
}
