'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * 顶部导航栏组件
 * 根据当前路径高亮激活的导航项
 */
export default function Header() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: '首页' },
    { href: '/categories', label: '分类' },
    { href: '/tags', label: '标签' },
    { href: '/search', label: '搜索' },
    { href: '/about', label: '关于' },
    { href: '/links', label: '友链' },
  ]

  return (
    <header className="header">
      <Link href="/" className="logo" aria-label="Home" />
      <nav className="menu">
        {links.map(link => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? 'active' : ''}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
