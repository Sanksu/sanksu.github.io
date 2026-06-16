import fs from 'fs'
import path from 'path'

export const SITE_URL = 'https://sanksu.cn'

/**
 * 读取 _data 目录下的 JSON 文件
 * @throws 当文件不存在或 JSON 格式错误时抛出异常
 */
export function readJson<T = unknown>(filename: string): T {
  const filePath = path.join(process.cwd(), '_data', filename)

  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filePath}`)
  }

  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
  } catch (error) {
    throw new Error(`Failed to parse JSON file ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
