import TagsContent from './TagsContent'
import { getTags } from '@/lib/posts'
import { getPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('tags') as Metadata

export default function TagsPage() {
  const tags = getTags()
  return <TagsContent tags={tags} />
}
