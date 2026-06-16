import HomeContent from './HomeContent'
import { getPostsByYear } from '@/lib/posts'
import { getPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('home') as Metadata

export default function HomePage() {
  const postsByYear = getPostsByYear()
  return <HomeContent postsByYear={postsByYear} />
}
