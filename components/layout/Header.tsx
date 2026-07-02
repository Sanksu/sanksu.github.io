'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: '首页' },
  { href: '/categories', label: '分类' },
  { href: '/tags', label: '标签' },
  { href: '/search', label: '搜索' },
  { href: '/about', label: '关于' },
  { href: '/links', label: '友链' },
] as const

/**
 * 判断当前导航项是否激活
 * - 首页仅精确匹配 `/` 或 `/index/`
 * - 其他项匹配自身路径或其子路径（兼容 trailingSlash）
 */
function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/' || pathname === '/index/'
  }
  const normalized = href.endsWith('/') ? href : `${href}/`
  return pathname === normalized || pathname.startsWith(normalized)
}

/**
 * 顶部导航栏组件
 * 根据当前路径高亮激活的导航项
 */
export default function Header() {
  const pathname = usePathname()

  return (
    <header className="header">
      <Link href="/" className="logo" aria-label="Home" />
      <nav className="menu">
        {NAV_LINKS.map(link => {
          const active = isActive(pathname, link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={active ? 'active' : ''}
              aria-current={active ? 'page' : undefined}
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
