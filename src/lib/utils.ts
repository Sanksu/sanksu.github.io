/** 核心工具函数集：字符串处理、日期格式化、转义、slug 生成 */

/** 从文件名提取 slug（去掉日期前缀和 .md 后缀） */
export function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-?/, '')
}

/** 将 YYYY-MM-DD 格式的日期字符串格式化为 YYYY/MM/DD */
export function formatDate(dateStr: string): string {
  return dateStr.replace(/-/g, '/')
}

/** 将 Date 对象格式化为 YYYY-MM-DD */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 计算文章阅读时间（分钟），基于中文字符 300 字/分钟 */
export function getReadingTime(content: string): number {
  const text = stripMarkdown(content)
  return Math.max(1, Math.ceil(text.length / 300))
}

/** 去除 Markdown 标记，返回纯文本（无空白） */
export function stripMarkdown(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`[\]]/g, '')
    .replace(/\s+/g, '')
}

/** 去除 HTML 标签和 Markdown 标记，返回纯文本（保留空白） */
export function stripHtml(str: string): string {
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/[#*`[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * 生成 URL 友好的 slug
 * 移除 HTML 标签、Markdown 内联格式和链接语法，空白替换为短横线并转小写
 */
export function slugify(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[*_~`]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-_]/g, '')
}

/** XML 实体转义（用于 RSS、Sitemap） */
export function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** HTML 实体转义 */
export function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
}

/** 转义正则表达式特殊字符 */
export function escapeReg(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
