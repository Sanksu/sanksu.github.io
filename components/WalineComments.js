'use client'

import { useEffect, useRef } from 'react'
import { init } from '@waline/client/full'
import '@waline/client/style'

export default function WalineComments({ serverURL, path }) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const waline = init({
      el: containerRef.current,
      serverURL,
      path,
      pageview: true,
      dark: 'html[class="dark"]',
      search: false,
      emoji: [
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/BangDream/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Popipa/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Afterglow/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/RAS/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/PastelPalettes/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Mygo/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/AveMujica/',
      ],
    })

    return () => waline?.destroy()
  }, [serverURL, path])

  return <div ref={containerRef} id="waline" />
}
