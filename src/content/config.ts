import { defineCollection, z } from 'astro:content'

/**
 * 文章内容集合
 * 从 `src/content/posts/` 目录读取 Markdown 文章
 * 文件名格式：`YYYY-MM-DD-slug.md`，slug 由文件名自动派生（去除日期前缀）
 */
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    /** 文章标题 */
    title: z.string(),
    /** 发布日期，格式 YYYY-MM-DD */
    date: z.coerce.date(),
    /** 文章分类 */
    categories: z.array(z.string()).default([]),
    /** 文章标签 */
    tags: z.array(z.string()).default([]),
  }),
})

export const collections = { posts }
