import { readJson } from './data'

/** 项目作品数据结构 */
export interface Project {
  name: string
  desc: string
  url: string
  tags: string[]
}

/** 时间线条目数据结构 */
export interface TimelineItem {
  year: string
  title: string
  desc: string
  /** 外部链接（兼容旧字段） */
  link?: string
  /** 外部链接（新字段） */
  url?: string
}

/** 技能数据结构 */
export interface Skill {
  /** 唯一标识 */
  id: string
  /** 技能名称 */
  name: string
  /** 熟练度等级 (1-10) */
  level: number
  /** 技能描述 */
  description: string
}

/** 技能分类数据结构 */
export interface SkillCategory {
  /** 分类标识 */
  id: string
  /** 分类名称 */
  name: string
  /** 该分类下的技能列表 */
  skills: Skill[]
}

let _skillsCache: SkillCategory[] | null = null
let _timelineCache: TimelineItem[] | null = null
let _projectsCache: Project[] | null = null

/**
 * 获取技能分类数据
 * @returns 从 `_data/skills.json` 读取的技能分类数组
 */
export function getSkills(): SkillCategory[] {
  if (!_skillsCache) _skillsCache = readJson<SkillCategory[]>('skills.json')
  return _skillsCache
}

/**
 * 获取时间线数据
 * @returns 从 `_data/timeline.json` 读取的时间线条目数组
 */
export function getTimeline(): TimelineItem[] {
  if (!_timelineCache) _timelineCache = readJson<TimelineItem[]>('timeline.json')
  return _timelineCache
}

/**
 * 获取项目作品数据
 * @returns 从 `_data/projects.json` 读取的项目数组
 */
export function getProjects(): Project[] {
  if (!_projectsCache) _projectsCache = readJson<Project[]>('projects.json')
  return _projectsCache
}
