import { readJson } from './data'

export interface Project {
  name: string
  desc: string
  url: string
  tags: string[]
}

export interface TimelineItem {
  year: string
  title: string
  desc: string
  link?: string
  url?: string
}

export interface Skill {
  id: string
  name: string
  level: number
  description: string
}

export interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

/** 获取技能数据 */
export function getSkills(): SkillCategory[] {
  return readJson<SkillCategory[]>('skills.json')
}

/** 获取时间线数据 */
export function getTimeline(): TimelineItem[] {
  return readJson<TimelineItem[]>('timeline.json')
}

/** 获取项目数据 */
export function getProjects(): Project[] {
  return readJson<Project[]>('projects.json')
}
