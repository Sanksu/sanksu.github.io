'use client'

import { useEffect, useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const elements = ref.current.querySelectorAll('.scroll-animate')
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
