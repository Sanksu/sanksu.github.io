import { Marked, type Tokens } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { escapeHtml } from './utils'

/** 危险协议正则 - 阻止 XSS 攻击 */
const DANGEROUS_SCHEMES = /^(javascript|data|vbscript):/i

/**
 * HTML 属性安全转义（防 XSS）
 * @param str - 原始字符串
 * @returns 转义后的安全字符串
 */
function safeAttr(str: string): string {
  return escapeHtml(str).replace(/"/g, '&quot;')
}

/**
 * 校验图片 src 是否安全
 * @param src - 图片 URL
 * @returns `true` 表示安全，`false` 表示包含危险协议
 */
function isSafeSrc(src: string): boolean {
  return !DANGEROUS_SCHEMES.test(src.trim())
}

/**
 * 生成标题的 URL 友好 slug
 * 移除 HTML 标签和 Markdown 格式标记后转为短横线连接的小写文本
 * @param text - 标题文本（可能含内联 HTML）
 * @returns URL 安全的 id 字符串
 */
function slugify(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/[*_~`]/g, '').trim().replace(/\s+/g, '-').toLowerCase()
}

/** Marked 实例缓存（单例） */
let markedInstance: Marked | null = null

/**
 * 获取配置好的 Marked 实例
 * 包含自定义 renderer（图片懒加载/安全校验、标题 id 生成）和代码高亮
 * @returns 已使用 `markedHighlight` 插件的 Marked 实例（单例）
 */
function getMarked(): Marked {
  if (markedInstance) return markedInstance

  const instance = new Marked({
    // 启用 GFM 换行：单个换行符也解析为 <br>
    breaks: true,
    renderer: {
      /**
       * 自定义图片渲染
       * - 校验 src 是否安全（防 XSS）
       * - GIF 图不加 lazy/async 以避免播放异常
       * - 添加淡入过渡效果
       */
      image(token: Tokens.Image) {
        const { href, text } = token
        if (!isSafeSrc(href)) return ''
        const isGif = href.toLowerCase().endsWith('.gif')
        const extraAttrs = isGif ? '' : ' loading="lazy" decoding="async"'
        return `<span class="img-container${isGif ? ' img-container--gif' : ''}"><img src="${safeAttr(href)}" alt="${safeAttr(text)}"${extraAttrs} onload="this.style.opacity=1" style="opacity:0;transition:opacity .3s" /></span>`
      },

      /**
       * 自定义标题渲染
       * - 通过 `parser.parseInline` 解析内联 tokens（正确处理 **bold** 等格式）
       * - 自动生成 slug 作为锚点 id
       */
      heading(this: { parser: { parseInline(tokens: Tokens.Generic[]): string } }, token: Tokens.Heading) {
        const text = this.parser.parseInline(token.tokens)
        const id = slugify(text)
        return `<h${token.depth} id="${id}">${text}</h${token.depth}>`
      },
    },
  })

  // 代码语法高亮插件
  instance.use(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      /**
       * 代码高亮回调
       * @param code - 原始代码文本
       * @param lang - 语言标识（如 typescript、python）
       * @returns 高亮后的 HTML 字符串
       */
      highlight(code: string, lang: string) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
    }),
  )

  markedInstance = instance
  return instance
}

/**
 * 将 Markdown 字符串转为 HTML
 * 在服务端构建时调用，不进入客户端 bundle
 * @param content - 原始 Markdown 文本
 * @returns 渲染后的 HTML 字符串
 */
export function markdownToHtml(content: string): string {
  return getMarked().parse(content) as string
}
