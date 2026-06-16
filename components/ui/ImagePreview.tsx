'use client'

import { useEffect, useState } from 'react'

/**
 * 图片预览组件
 * 点击文章正文中的图片时，以全屏遮罩形式预览原图
 * 点击遮罩关闭
 */
export default function ImagePreview() {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'IMG' && target.closest('.post-content')) {
        setPreviewSrc((target as HTMLImageElement).src)
      }
    }

    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!previewSrc) return null

  return (
    <div className="image-preview-overlay" onClick={() => setPreviewSrc(null)}>
      <img src={previewSrc} alt="preview" />
    </div>
  )
}
