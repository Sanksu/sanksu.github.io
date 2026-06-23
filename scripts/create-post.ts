#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

/**
 * 生成 URL 友好的文件名 slug
 * 保留所有语言的字母/数字，移除特殊字符，并将空白替换为短横线
 */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, '')
    .trim()
    .replace(/\s+/gu, '-')
    .replace(/-+/gu, '-')
}

/**
 * 将日期格式化为 YYYY-MM-DD
 */
function formatDate(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 将逗号分隔字符串解析为数组
 */
function parseList(input?: string): string[] {
  if (!input) return []
  return input.split(',').map(s => s.trim()).filter(Boolean)
}

/**
 * 将数组格式化为 Markdown front-matter 列表 `[a, b]`
 */
function formatList(items: string[]): string {
  if (items.length === 0) return '[]'
  return `[${items.join(', ')}]`
}

/**
 * 根据命令行参数生成新的文章 Markdown 文件
 * 用法：npx tsx scripts/create-post.ts "文章标题" "分类1,分类2" "标签1,标签2"
 */
function main() {
  const args = process.argv.slice(2)
  const title = args[0]

  if (!title) {
    console.error('用法: npx tsx scripts/create-post.ts "文章标题" [分类,多个] [标签,多个]')
    process.exit(1)
  }

  const categories = parseList(args[1])
  const tags = parseList(args[2])
  const date = formatDate()
  const slug = slugify(title)
  const filename = `${date}-${slug}.md`
  const filePath = path.join(process.cwd(), '_posts', filename)

  if (fs.existsSync(filePath)) {
    console.error(`文件已存在: ${filePath}`)
    process.exit(1)
  }

  const content = `---
title: ${title}
date: ${date}
categories: ${formatList(categories)}
tags: ${formatList(tags)}
pinned: false
---

## ${title}

`

  fs.writeFileSync(filePath, content, 'utf8')
  console.log(`文章已创建: ${filePath}`)
}

main()
