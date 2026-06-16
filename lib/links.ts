import { readJson } from './data'

export interface Link {
  name: string
  desc: string
  url: string
  avatar?: string
}

export function getLinks(): Link[] {
  return readJson<Link[]>('links.json')
}
