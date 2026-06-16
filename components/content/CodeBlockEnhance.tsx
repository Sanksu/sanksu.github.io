'use client'

import { useEffect, useRef, useCallback } from 'react'

/**
 * 代码块增强组件
 * 为所有 `.post-content` 中的 `<pre><code>` 添加：
 * - 语言标签（左上角）
 * - 复制按钮（右上角）
 * - 外层 `.code-block-wrapper` 包装器
 * 通过 MutationObserver 监听动态内容变化
 */
export default function CodeBlockEnhance() {
  const handlersRef = useRef(new Map<HTMLButtonElement, () => void>())

  /** 复制代码并显示反馈 */
  const handleCopy = useCallback(async (code: string, btn: HTMLButtonElement) => {
    try {
      await navigator.clipboard.writeText(code)
      btn.textContent = '已复制'
      setTimeout(() => { btn.textContent = '复制' }, 2000)
    } catch {
      btn.textContent = '复制失败'
      setTimeout(() => { btn.textContent = '复制' }, 2000)
    }
  }, [])

  /** 为单个代码块添加包装器和工具栏 */
  const enhanceBlock = useCallback((block: HTMLElement) => {
    if (block.dataset.enhanced) return
    block.dataset.enhanced = 'true'

    const pre = block.parentElement
    if (!pre?.parentElement || pre.closest('.code-block-wrapper')) return

    const wrapper = document.createElement('div')
    wrapper.className = 'code-block-wrapper'

    const langMatch = block.className.match(/language-(\w+)/)
    const langLabel = document.createElement('span')
    langLabel.className = 'code-lang'
    langLabel.textContent = langMatch ? langMatch[1] : 'text'

    const btn = document.createElement('button')
    btn.className = 'code-copy-btn'
    btn.textContent = '复制'
    const onClick = () => handleCopy(block.textContent || '', btn)
    btn.addEventListener('click', onClick)
    handlersRef.current.set(btn, onClick)

    const bar = document.createElement('div')
    bar.className = 'code-bar'
    bar.append(btn)

    pre.replaceWith(wrapper)
    wrapper.append(langLabel, bar, pre)
  }, [handleCopy])

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('.post-content pre code').forEach(enhanceBlock)

    const target = document.querySelector('.post-content') || document.body

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return
          const el = node as HTMLElement
          if (el.tagName === 'PRE') {
            const code = el.querySelector<HTMLElement>('code')
            if (code) enhanceBlock(code)
          } else {
            el.querySelectorAll?.('pre code')?.forEach(c => enhanceBlock(c as HTMLElement))
          }
        })
      })
    })

    observer.observe(target, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      handlersRef.current.forEach((fn, btn) => btn.removeEventListener('click', fn))
      handlersRef.current.clear()
    }
  }, [enhanceBlock])

  return null
}
