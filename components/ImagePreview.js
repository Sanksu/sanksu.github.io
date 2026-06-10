'use client'

import { useEffect, useState } from 'react'

export default function ImagePreview() {
  const [previewSrc, setPreviewSrc] = useState(null)

  useEffect(() => {
    function handleClick(e) {
      if (e.target.tagName === 'IMG' && e.target.closest('.post-content')) {
        setPreviewSrc(e.target.src)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  if (!previewSrc) return null

  return (
    <div className="image-preview-overlay" onClick={() => setPreviewSrc(null)}>
      <img src={previewSrc} alt="preview" />
    </div>
  )
}
