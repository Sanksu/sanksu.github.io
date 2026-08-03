import { defineCollection, z } from 'astro:content'

/**
 * 文章内容集合
 * 从 `src/content/posts/` 目录读取 Markdown/MDX 文章
 * 文件名格式：`YYYY-MM-DD-slug.md` 或 `.mdx`，slug 由文件名自动派生（去除日期前缀）
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
    /** 文章封面图（外部 URL 或本地路径），可选 */
    cover: z.string().optional(),
  }),
})

/** 关于页简介集合 */
const about = defineCollection({
  type: 'content',
  schema: z.object({
    /** 一句话定位 */
    tagline: z.string().default(''),
  }),
})

export const collections = { posts, about }
