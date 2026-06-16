'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)
  const ticking = useRef(false)

  const updateProgress = useCallback(() => {
    if (ticking.current) return

    ticking.current = true
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        document.body.scrollHeight - window.innerHeight,
        0
      )

      // 确保进度在 0-100 范围内
      let newProgress = 0
      if (docHeight > 0) {
        newProgress = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100)
      }

      setProgress(newProgress)
      ticking.current = false
      rafRef.current = null
    })
  }, [])

  useEffect(() => {
    // 初始更新
    updateProgress()

    // 使用 passive 监听器优化滚动性能
    const handleScroll = () => updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })

    // 延迟显示，避免页面切换动画期间闪现
    const visibilityTimer = setTimeout(() => setVisible(true), 400)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(visibilityTimer)
      ticking.current = false
    }
  }, [updateProgress])

  return (
    <div
      className={`reading-progress ${visible ? 'reading-progress--visible' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="阅读进度"
    >
      <div className="reading-progress__bar" style={{ width: `${progress}%` }} />
    </div>
  )
}
