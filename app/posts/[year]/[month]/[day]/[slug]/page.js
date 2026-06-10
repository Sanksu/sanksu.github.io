import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PostContent from './PostContent'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'

export function generateStaticParams() {
  return getAllPostSlugs()
}

export default async function PostPage({ params }) {
  const { year, month, day, slug } = await params
  const post = getPostBySlug(slug)

  return (
    <>
      <Header />
      <PostContent post={post} postPath={`/posts/${year}/${month}/${day}/${slug}`} />
      <Footer />
    </>
  )
}
