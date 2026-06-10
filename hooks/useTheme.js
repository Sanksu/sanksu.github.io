'use client'

import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.darkMode
    if (stored === 'true') setIsDark(true)
    else if (stored === 'false') setIsDark(false)
    else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches)
  }, [])

  function toggleTheme() {
    const next = !isDark
    setIsDark(next)
    localStorage.darkMode = String(next)
    document.documentElement.className = next ? 'dark' : ''
  }

  return { isDark, toggleTheme }
}
