import { readJson } from './data'

/** 站点全局配置数据结构 */
interface MetadataSite {
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

/** 页面级元数据 */
interface MetadataPage {
  title: string
  description: string
}

/** 完整的元数据配置 */
interface MetadataConfig {
  site: MetadataSite
  pages: Record<string, MetadataPage>
}

/** Waline 评论系统配置 */
interface WalineConfig {
  serverURL: string
  emoji: string[]
}

let _configCache: MetadataConfig | null = null
let _walineCache: WalineConfig | null = null

/**
 * 获取完整元数据配置（缓存单例）
 * @returns 从 `_data/metadata.json` 解析的配置对象
 */
function getConfig(): MetadataConfig {
  if (!_configCache) {
    _configCache = readJson<MetadataConfig>('metadata.json')
  }
  return _configCache
}

/**
 * 获取站点级元数据
 * 用于 Next.js `layout.tsx` 的 `generateMetadata` 和 RSS 生成
 * @returns 包含 title、description、openGraph、twitter 等字段的元数据对象
 */
export function getSiteMetadata() {
  const { site } = getConfig()
  return {
    title: site.title,
    description: site.description,
    authors: site.authors,
    keywords: site.keywords,
    icons: site.icons,
    openGraph: {
      title: site.title,
      description: site.description,
      url: site.url,
      siteName: site.openGraph.siteName,
      type: 'website',
      locale: site.openGraph.locale,
    },
    twitter: {
      card: site.twitter.card,
      title: site.title,
      description: site.description,
    },
    other: site.other,
  }
}

/**
 * 获取页面级元数据
 * 用于各路由的 `generateMetadata`
 * @param pageKey - 页面标识（如 'home', 'about'），对应 `_data/metadata.json` 中 `pages` 的键
 * @returns 页面标题和描述，首页额外包含 RSS alternates 配置
 */
export function getPageMetadata(pageKey: string) {
  const { pages } = getConfig()
  const page = pages[pageKey]
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    ...(pageKey === 'home' ? {
      alternates: {
        types: { 'application/rss+xml': '/rss.xml' },
      },
    } : {}),
  }
}

/** 获取站点根 URL */
export function getSiteUrl(): string {
  return getConfig().site.url
}

/** 获取站点名称（用于 Open Graph `siteName`） */
export function getSiteName(): string {
  return getConfig().site.openGraph.siteName
}

/**
 * 获取 Waline 评论配置（缓存单例）
 * @returns 包含 serverURL 和 emoji 列表的 Waline 配置对象
 */
export function getWalineConfig(): WalineConfig {
  if (!_walineCache) {
    _walineCache = readJson<WalineConfig>('waline.json')
  }
  return _walineCache
}
