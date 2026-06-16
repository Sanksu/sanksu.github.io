import { useState, useEffect, useRef } from 'react'

/**
 * 打字机动画 Hook
 * 当 description 变化时，逐字显示文本，模拟打字效果
 */
export function useTypingEffect(description: string, speed = 28): string {
  const [typedText, setTypedText] = useState('')
  const prevDescRef = useRef('')

  useEffect(() => {
    if (description === prevDescRef.current) return
    prevDescRef.current = description
    setTypedText('')
    if (!description) return

    let i = 0
    const timer = setInterval(() => {
      i++
      setTypedText(description.slice(0, i))
      if (i >= description.length) clearInterval(timer)
    }, speed)

    return () => clearInterval(timer)
  }, [description, speed])

  return typedText
}
