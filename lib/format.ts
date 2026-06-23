/**
 * 格式化工具函数
 * 包含：日期格式化、URL生成、阅读时间计算等
 */

import { stripMarkdown } from './utils'
import type { Post } from './posts'

/**
 * 格式化日期显示（将 - 替换为 /）
 */
export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '/')
}

/**
 * 生成文章 URL 路径
 * 对 slug 路径段做 URL 编码，确保含非 ASCII 字符（如中文）的 slug
 * 能在所有浏览器和 Next.js `output: 'export'` 模式下正常工作
 */
export function postUrl(post: Post): string {
  const [year, month, day] = post.date.split('-')
  return `/posts/${year}/${month}/${day}/${encodeURIComponent(post.slug)}`
}

/**
 * 计算文章阅读时间（分钟）
 * 基于中文字符平均阅读速度：300字/分钟
 */
export function getReadingTime(content: string): number {
  const text = stripMarkdown(content)
  return Math.max(1, Math.ceil(text.length / 300))
}
