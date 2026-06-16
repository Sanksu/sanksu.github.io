'use client'

import { useState, useEffect, useRef } from 'react'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [hidden, setHidden] = useState(false)
  const startRef = useRef(Date.now())

  useEffect(() => {
    let done = false
    const MIN_TIME = 300

    function hide() {
      if (done) return
      done = true

      const elapsed = Date.now() - startRef.current
      const remaining = Math.max(MIN_TIME - elapsed, 0)

      setTimeout(() => {
        setVisible(false)
        setTimeout(() => setHidden(true), 400)
      }, remaining)
    }

    if (document.readyState === 'complete') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
    }

    return () => {
      window.removeEventListener('load', hide)
    }
  }, [])

  if (hidden) return null

  return (
    <div className={`loading-screen ${visible ? '' : 'loading-screen--fade'}`}>
      <div className="loading-screen__spinner">
        <div className="loading-screen__cube" />
      </div>
    </div>
  )
}
