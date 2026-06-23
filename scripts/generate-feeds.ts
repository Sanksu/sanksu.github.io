/**
 * 生成 RSS 和 Sitemap 文件
 * 在 `dev` / `build` 启动前执行，输出到 `public/`
 */
import { generateRss } from '../lib/rss.js'
import { generateSitemap } from '../lib/sitemap.js'

generateRss()
generateSitemap()
