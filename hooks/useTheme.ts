'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState<boolean | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('darkMode')
    if (stored === 'true') setIsDark(true)
    else if (stored === 'false') setIsDark(false)
    else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  const toggleTheme = useCallback(() => {
    // 使用 rAF 确保在浏览器空闲时执行，避免阻塞渲染
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    rafRef.current = requestAnimationFrame(() => {
      setIsDark(prev => {
        const next = !prev
        const d = document.documentElement

        // 先移除旧类名，再添加新类名，减少中间状态的重绘
        d.classList.remove('dark', 'theme-transitioning')

        // 使用 force reflow 确保类名移除生效
        void d.offsetHeight

        // 添加新的类名
        d.className = [next ? 'dark' : '', 'theme-transitioning'].filter(Boolean).join(' ')

        // 保存偏好
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
