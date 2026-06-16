'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

/**
 * 顶部阅读进度条组件
 * 固定定位在视口顶部，实时反映页面滚动进度
 * - 使用 rAF 节流 + passive 滚动监听优化性能
 * - 延迟 400ms 显示，避免页面切换动画期间闪现
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const rafRef = useRef<number | null>(null)
  const ticking = useRef(false)

  /** 计算并更新阅读进度百分比（rAF 节流） */
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