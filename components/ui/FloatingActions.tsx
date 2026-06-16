'use client'

import { useTheme } from '@/hooks/useTheme'
import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * 浮动操作按钮组件
 * 固定在页面右下角，包含：
 * - 回到顶部按钮（滚动超过 300px 时显示）
 * - 亮/暗主题切换按钮
 */
export default function FloatingActions() {
  const { isDark, toggleTheme } = useTheme()
  const [showTop, setShowTop] = useState(false)
  const rafRef = useRef<number | null>(null)

  /** 滚动监听：超过 300px 显示回到顶部按钮（rAF 节流） */
  const handleScroll = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      setShowTop(window.scrollY > 300)
      rafRef.current = null
    })
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [handleScroll])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // SSR hydration safety — 主题状态未确定时不渲染
  if (isDark === null) return null

  return (
    <div className="floating-actions">
      <button
        className={`float-btn to-top ${showTop ? 'show' : ''}`}
        onClick={scrollToTop}
        title="回到顶部"
        aria-label="回到顶部"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </button>
      <button
        className="float-btn"
        onClick={toggleTheme}
        title={isDark ? '切换亮色模式' : '切换暗色模式'}
        aria-label={isDark ? '切换亮色模式' : '切换暗色模式'}
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>
    </div>
  )
}

/** 太阳图标（浅色模式按钮） */
function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

/** 月亮图标（深色模式按钮） */
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
