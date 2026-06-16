import { readJson } from './data'

/** 友链结构 */
export interface Link {
  /** 站点名称 */
  name: string
  /** 站点描述 */
  desc: string
  /** 站点 URL */
  url: string
  /** 头像 URL（可选） */
  avatar?: string
}

/**
 * 获取友情链接列表
 * @returns 从 `_data/links.json` 读取的友链数组
 */
export function getLinks(): Link[] {
  return readJson<Link[]>('links.json')
}
