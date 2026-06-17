'use client'

import { useState, useEffect, useRef } from 'react'

/** 安全超时：无论如何 5 秒后强制隐藏，防止事件丢失导致卡住 */
//const SAFETY_TIMEOUT = 10000

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let done = false
    const MIN_TIME = 500

    function hide() {
      if (done) return
      done = true

      setTimeout(() => {
        setVisible(false)
        // 等 fade-out 过渡完成后移除 DOM
        setTimeout(() => setHidden(true), 400)
      }, MIN_TIME)
    }

    // readyState 为 complete 或 interactive 都视为页面已就绪
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      hide()
    } else {
      window.addEventListener('load', hide, { once: true })
    }

    // 安全兜底：超时强制隐藏
    //const safetyTimer = setTimeout(hide, SAFETY_TIMEOUT)

//    return () => {
//      window.removeEventListener('load', hide)
//      clearTimeout(safetyTimer)
//    }
  }, [])

  if (hidden) return null

  return (
    <div className={`loading-screen ${visible ? '' : 'loading-screen--fade'}`}>
      <div className="loading-screen__grid">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="loading-screen__cube">
            <div className="loading-screen__cube-inner">
              <div className="loading-screen__cube-face loading-screen__cube-face--front" />
              <div className="loading-screen__cube-face loading-screen__cube-face--back" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
