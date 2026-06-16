/**
 * 核心工具函数集
 * 包含：字符串处理、日期格式化、转义函数等通用工具
 */

/**
 * 从文件名提取 slug（去掉日期前缀和 .md 后缀）
 */
export function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '')
}

/**
 * 统一处理 gray-matter 解析出的日期值
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
