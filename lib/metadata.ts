import { readJson } from './data'

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

interface MetadataPage {
  title: string
  description: string
}

interface MetadataConfig {
  site: MetadataSite
  pages: Record<string, MetadataPage>
}

interface WalineConfig {
  serverURL: string
  emoji: string[]
}

let _configCache: MetadataConfig | null = null
let _walineCache: WalineConfig | null = null

function getConfig(): MetadataConfig {
  if (!_configCache) {
    _configCache = readJson<MetadataConfig>('metadata.json')
  }
  return _configCache
}

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

export function getSiteUrl(): string {
  return getConfig().site.url
}

export function getSiteName(): string {
  return getConfig().site.openGraph.siteName
}

export function getWalineConfig(): WalineConfig {
  if (!_walineCache) {
    _walineCache = readJson<WalineConfig>('waline.json')
  }
  return _walineCache
}
