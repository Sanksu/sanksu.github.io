import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoriesContent from './CategoriesContent'
import { getCategories } from '@/lib/posts'

export default function CategoriesPage() {
  const categories = getCategories()
  return (
    <>
      <Header />
      <CategoriesContent categories={categories} />
      <Footer />
    </>
  )
}
