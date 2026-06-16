'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * 主题切换 Hook
 * 管理亮/暗主题状态，支持 localStorage 持久化
 * @returns `{ isDark, toggleTheme }` — 当前主题状态和切换函数
 *
 * 初始化逻辑：localStorage > 系统偏好 > 默认 false
 * 切换时使用 `theme-transitioning` class 触发 CSS 过渡动画
 */
export function useTheme() {
  const [isDark, setIsDark] = useState<boolean | null>(null)
  const rafRef = useRef<number | null>(null)

  // 客户端挂载后从 localStorage 或系统偏好读取初始主题
  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') setIsDark(true)
    else if (stored === 'false') setIsDark(false)
    else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  /**
   * 切换主题
   * 使用 rAF 批量 DOM 写入 + force reflow 技巧避免布局抖动
   */
  const toggleTheme = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      setIsDark(prev => {
        const next = !prev
        const d = document.documentElement

        d.classList.remove('dark', 'theme-transitioning')
        void d.offsetHeight // force reflow
        d.className = [next ? 'dark' : '', 'theme-transitioning'].filter(Boolean).join(' ')

        localStorage.setItem('darkMode', String(next))

        // 过渡结束后清理
        setTimeout(() => {
          d.classList.remove('theme-transitioning')
        }, 400)

        return next
      })
    })
  }, [])

  return { isDark, toggleTheme }
}
