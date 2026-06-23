'use client'

import { useState, useEffect } from 'react'

/** 全局底部组件 */
export default function Footer() {
  const [year, setYear] = useState(2020)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="footer">
      <span>© 2020-{year} Sanksu</span>
      <a href="https://icp.gov.moe/?keyword=20251337" target="_blank" rel="noopener noreferrer">萌ICP备20251337号</a>
      <a href="https://github.com/sanksu" target="_blank" rel="noopener noreferrer">GitHub</a>
    </footer>
  )
}
