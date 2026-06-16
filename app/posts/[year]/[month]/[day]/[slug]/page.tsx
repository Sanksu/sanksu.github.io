import PostContent from './PostContent'
import { getPostBySlug, getAllPostSlugs, getAdjacentPosts } from '@/lib/posts'
import { postUrl } from '@/lib/format'
import { getSiteUrl, getSiteName, getWalineConfig } from '@/lib/metadata'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllPostSlugs()
}

interface Props {
  params: Promise<{ year: string; month: string; day: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: '文章未找到' }

  return {
    title: `${post.title} - ${getSiteName()}`,
    description: `${post.title}${post.categories.length ? ` · ${post.categories.join(', ')}` : ''}`,
    openGraph: {
      title: post.title,
      description: post.content.replace(/[#*`\[\]]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160),
      url: `${getSiteUrl()}${postUrl(post)}`,
      siteName: getSiteName(),
      type: 'article',
      publishedTime: post.date,
      tags: post.categories,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { year, month, day, slug } = await params
  const post = getPostBySlug(slug)
  const adjacent = getAdjacentPosts(slug)

  return (
    <PostContent
      post={post}
      postPath={`/posts/${year}/${month}/${day}/${slug}`}
      prevPost={adjacent.prev}
      nextPost={adjacent.next}
      walineConfig={getWalineConfig()}
    />
  )
}
