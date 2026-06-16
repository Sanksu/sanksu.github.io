import CategoriesContent from './CategoriesContent'
import { getCategories } from '@/lib/posts'
import { getPageMetadata } from '@/lib/metadata'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('categories') as Metadata

export default function CategoriesPage() {
  const categories = getCategories()
  return <CategoriesContent categories={categories} />
}
