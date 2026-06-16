/**
 * 核心工具函数集
 * 包含：字符串处理、日期格式化、转义函数、front-matter 解析等通用工具
 */

import yaml from 'js-yaml'

/** 解析 front-matter 的返回类型 */
export interface FrontMatterResult<T = Record<string, unknown>> {
  /** 解析后的 front-matter 数据 */
  data: T
  /** front-matter 之后的正文内容 */
  content: string
}

/**
 * 解析 YAML front-matter（替换 gray-matter）
 * 从文件内容中提取 `---` 包裹的 YAML 元数据并返回数据和正文
 * @param fileContents - 完整的 .md 文件内容
 * @returns `{ data, content }` — data 为解析后的对象，content 为正文
 *
 * @example
 * ```ts
 * const { data, content } = parseFrontMatter('---\ntitle: Hello\n---\nBody text')
 * // data = { title: 'Hello' }
 * // content = 'Body text'
 * ```
 */
export function parseFrontMatter<T = Record<string, unknown>>(fileContents: string): FrontMatterResult<T> {
  // 以 "---\n" 或 "---\r\n" 开头才视为 front-matter
  const startMatch = fileContents.match(/^---\r?\n/)
  if (!startMatch) {
    return { data: {} as T, content: fileContents }
  }

  const startOffset = startMatch[0].length
  const endIndex = fileContents.indexOf('\n---', startOffset)
  if (endIndex === -1) {
    return { data: {} as T, content: fileContents.slice(startOffset) }
  }

  const yamlStr = fileContents.slice(startOffset, endIndex)
  const content = fileContents.slice(endIndex + 4).replace(/^\r?\n/, '')

  try {
    const data = yaml.load(yamlStr) as T
    return { data: data ?? {} as T, content }
  } catch {
    console.warn('Failed to parse YAML front-matter, falling back to empty data')
    return { data: {} as T, content }
  }
}

/**
 * 从文件名提取 slug（去掉日期前缀和 .md 后缀）
 */
export function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

/**
 * 统一处理 front-matter 解析出的日期值
 */
export function normalizeDate(dateVal: unknown): string {
  if (dateVal instanceof Date) {
    const y = dateVal.getFullYear()
    const m = String(dateVal.getMonth() + 1).padStart(2, '0')
    const d = String(dateVal.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  return String(dateVal || '')
}

/**
 * 去除 Markdown 标记，返回纯文本（无空白）
 */
export function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`\[\]]/g, '')
    .replace(/\s+/g, '')
}

/**
 * 去除 HTML 标签和 Markdown 标记，返回纯文本（保留空白）
 */
export function stripHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * XML 实体转义（用于 RSS、Sitemap）
 */
export function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * HTML 实体转义
 */
export function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/=/g, '&#x3D;')
}

/**
 * 转义正则表达式特殊字符
 */
export function escapeReg(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
