import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchContent from './SearchContent'
import { getAllPosts } from '@/lib/posts'

export default function SearchPage() {
  const allPosts = getAllPosts().map(p => ({
    title: p.title,
    date: p.date,
    categories: p.categories,
    slug: p.slug,
    content: p.content,
  }))
  return (
    <>
      <Header />
      <SearchContent allPosts={allPosts} />
      <Footer />
    </>
  )
}
