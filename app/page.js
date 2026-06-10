import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomeContent from './HomeContent'
import { getPostsByYear } from '@/lib/posts'

export default function HomePage() {
  const postsByYear = getPostsByYear()
  return (
    <>
      <Header />
      <HomeContent postsByYear={postsByYear} />
      <Footer />
    </>
  )
}
