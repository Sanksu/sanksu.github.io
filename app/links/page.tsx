import LinksContent from './LinksContent'
import { getLinks } from '@/lib/links'
import { getPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('links') as Metadata

export default function LinksPage() {
  const links = getLinks()
  return <LinksContent links={links} />
}
