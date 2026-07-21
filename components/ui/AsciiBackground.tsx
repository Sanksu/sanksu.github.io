'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Monospace 字符宽高比（width / fontSize ≈ 0.6, height / fontSize = 1.0 with line-height:1）
 * sampleX:sampleY = 3:5 补偿字符宽高比，使 ASCII 网格的显示比例与 GIF 原始比例一致
 */
const CHAR_W = 0.6
const CHAR_H = 1.0

/**
 * ASCII 背景动画组件
 * 使用 gif2asciiart 库将 /badapple.gif 渲染为 ASCII 动画作为网页背景
 *
 * 性能优化：
 * - 预处理所有帧（插入换行符），动画循环中仅做 textContent 赋值
 * - requestAnimationFrame + 时间戳累积，精确匹配 GIF 原始帧率
 * - delta 上限 100ms 防止后台标签页恢复时的帧跳
 * - 响应式 font-size 计算，窗口 resize 时去抖更新
 */
export default function AsciiBackground() {
  const preRef = useRef<HTMLPreElement>(null)
  const [ready, setReady] = useState(false)
  const [fontSize, setFontSize] = useState(8)

  // 动画状态存入 ref，避免 re-render
  const framesRef = useRef<{ d: number }[]>([])
  const formattedRef = useRef<string[]>([])
  const dimsRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    let rafId = 0
    let frameIndex = 0
    let lastTime = 0
    let accumulator = 0

    async function init() {
      try {
        const res = await fetch('/badapple.gif')
        const ab = await res.arrayBuffer()
        const { gifToAscii } = await import('gif2asciiart')

        const data = gifToAscii(ab, {
          sampleX: 4,
          sampleY: 5, // 补偿字符宽高比
          invertChars: true, // 暗部 → 空格（不可见），亮部 → 可见字符
          brightnessCutoff: 20,
          asciiChars: {
            dark: ['0'],
            gray: ['-'],
            light: [' '],
          },
        })

        const { w, h } = data
        dimsRef.current = { w, h }

        // 预处理：每 w 字符插入换行
        formattedRef.current = data.frames.map(f => {
          const lines = new Array(h)
          for (let y = 0; y < h; y++) {
            lines[y] = f.c.slice(y * w, (y + 1) * w)
          }
          return lines.join('\n')
        })

        framesRef.current = data.frames
        setReady(true)
        updateFontSize()

        lastTime = performance.now()
        rafId = requestAnimationFrame(animate)
      } catch {
        // 静默失败 — 背景是装饰性的
      }
    }

    function animate(time: number) {
      const delta = Math.min(time - lastTime, 100)
      lastTime = time
      accumulator += delta

      const frames = framesRef.current
      if (frames.length > 0) {
        // 根据累积时间推进到正确帧
        let iters = 0
        while (accumulator >= frames[frameIndex].d && iters < 10) {
          accumulator -= frames[frameIndex].d
          frameIndex = (frameIndex + 1) % frames.length
          iters++
        }

        if (preRef.current) {
          preRef.current.textContent = formattedRef.current[frameIndex]
        }
      }

      rafId = requestAnimationFrame(animate)
    }

    function updateFontSize() {
      const { w, h } = dimsRef.current
      if (w === 0 || h === 0) return

      const vw = window.innerWidth
      const vh = window.innerHeight
      // 等比缩放到视口内
      const sizeW = (vw * 0.98) / (w * CHAR_W)
      const sizeH = (vh * 0.98) / (h * CHAR_H)
      setFontSize(Math.max(2, Math.min(sizeW, sizeH)))
    }

    let resizeTimer: ReturnType<typeof setTimeout>
    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(updateFontSize, 150)
    }

    // 尊重 prefers-reduced-motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      init()
      window.addEventListener('resize', onResize)
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  if (!ready) return null

  return (
    <div className="ascii-bg" aria-hidden="true">
      <pre
        ref={preRef}
        className="ascii-bg__pre"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  )
}
