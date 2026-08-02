/** 站点全局配置（原 _data/metadata.json） */

export interface MetadataSite {
  title: string
  description: string
  url: string
  authors: { name: string }[]
  keywords: string[]
  icons: { icon: string; apple: string }
  openGraph: { siteName: string; locale: string }
  twitter: { card: string }
  other: Record<string, string>
}

export interface MetadataPage {
  title: string
  description: string
}

export interface MetadataConfig {
  site: MetadataSite
  pages: Record<string, MetadataPage>
}

/** Waline 评论系统配置 */
export interface WalineConfig {
  serverURL: string
  emoji: string[]
}

export const siteMetadata: MetadataConfig = {
  site: {
    title: 'Sanksu Blog',
    description: 'Sanksu的个人博客',
    url: 'https://sanksu.cn',
    authors: [{ name: 'Sanksu' }],
    keywords: ['Sanksu', 'Blog', 'Java', 'Html', 'JavaScript'],
    icons: {
      icon: '/assets/img/logo.ico',
      apple: '/assets/img/logo_256x256.png',
    },
    openGraph: {
      siteName: 'Sanksu Blog',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
    },
    other: {
      'theme-color': '#ffffff',
      'supported-color-schemes': 'light dark',
      renderer: 'webkit',
      'applicable-device': 'pc,mobile',
    },
  },
  pages: {
    home: {
      title: '首页 - Sanksu Blog',
      description: 'Sanksu的个人博客，分享技术、硬件与生活',
    },
    about: {
      title: '关于 - Sanksu Blog',
      description: '了解 Sanksu 的经历与项目',
    },
    categories: {
      title: '分类 - Sanksu Blog',
      description: '按分类浏览 Sanksu Blog 的所有文章',
    },
    tags: {
      title: '标签 - Sanksu Blog',
      description: '按标签浏览 Sanksu Blog 的所有文章',
    },
    search: {
      title: '搜索 - Sanksu Blog',
      description: '搜索 Sanksu Blog 中的文章',
    },
  },
}

export const walineConfig: WalineConfig = {
  serverURL: 'https://waline.sanksu.cn/',
  emoji: [],
}

/** 获取站点根 URL */
export function getSiteUrl(): string {
  return siteMetadata.site.url
}

/** 获取站点名称 */
export function getSiteName(): string {
  return siteMetadata.site.openGraph.siteName
}

/** 获取站点作者（默认取第一位） */
export function getSiteAuthor(): string {
  return siteMetadata.site.authors[0]?.name ?? 'Unknown'
}
