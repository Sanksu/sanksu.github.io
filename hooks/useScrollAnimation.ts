'use client'

import { useEffect, useRef } from 'react'

/**
 * 滚动入场动画 Hook
 * 返回一个 ref，绑定到容器元素后，其内部所有 `.scroll-animate` 子元素
 * 进入视口时自动添加 `.scroll-animated` 类名触发 CSS 过渡
 *
 * @returns ref — 绑定到希望启用滚动动画的容器元素
 *
 * @example
 * ```tsx
 * const ref = useScrollAnimation()
 * return <div ref={ref}><div className="scroll-animate">...</div></div>
 * ```
 */
export function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const elements = ref.current.querySelectorAll<HTMLElement>('.scroll-animate')
    if (!elements.length) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-animated')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}
