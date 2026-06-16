'use client'

import { useEffect, useRef } from 'react'
import { init, type WalineInitOptions } from '@waline/client/full'
import '@waline/client/style'

interface Props {
  serverURL: string
  path: string
  emoji?: string[]
}

/**
 * Waline 评论组件
 * 在客户端挂载后初始化 Waline 实例，卸载时销毁
 */
export default function WalineComments({ serverURL, path, emoji }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const options: WalineInitOptions = {
      el: containerRef.current,
      serverURL,
      path,
      pageview: true,
      dark: 'html[class="dark"]',
      search: false,
    }


    if (emoji && emoji.length > 0) {
      (options as unknown as Record<string, unknown>).emoji = emoji
    }

    const waline = init(options)

    return () => { waline?.destroy() }
  }, [serverURL, path, emoji])

  return <div ref={containerRef} id="waline" />
}
