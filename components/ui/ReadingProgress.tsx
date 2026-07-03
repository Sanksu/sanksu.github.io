'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'

/**
 * 顶部阅读进度条组件
 * 固定定位在视口顶部，实时反映页面滚动进度
 * - 使用 rAF 节流 + passive 滚动监听优化性能
 * - 通过 createPortal 渲染到 document.body，避免祖先 transform 创建包含块导致 fixed 定位失效
 * - 延迟 400ms 显示，避免页面切换动画期间闪现
 */
export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const rafRef = useRef<number | null>(null)

  /** 计算并更新阅读进度百分比（rAF 节流） */
  const updateProgress = useCallback(() => {
    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const docHeight = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0
      )

      let newProgress = 0
      if (docHeight > 0) {
        newProgress = Math.min(Math.max((scrollTop / docHeight) * 100, 0), 100)
      }

      setProgress(newProgress)
      rafRef.current = null
    })
  }, [])

  useEffect(() => {
    setMounted(true)

    // 初始更新（延迟一帧确保内容已布局）
    requestAnimationFrame(() => updateProgress())

    // 使用 passive 监听器优化滚动性能
    const handleScroll = () => updateProgress()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    // 延迟显示，避免页面切换动画期间闪现
    const visibilityTimer = setTimeout(() => setVisible(true), 400)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(visibilityTimer)
    }
  }, [updateProgress])

  if (!mounted) return null

  return createPortal(
    <>
      <style>{`.reading-progress{--progress:${progress}%}`}</style>
      <div
        className={`reading-progress ${visible ? 'reading-progress--visible' : ''}`}
        role="progressbar"
        aria-label="阅读进度"
      >
        <div className="reading-progress__bar" />
      </div>
    </>,
    document.body
  )
}
