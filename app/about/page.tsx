import SkillTree from '@/components/features/SkillTree'
import { getTimeline, getProjects, getSkills } from '@/lib/about'
import { getAllPosts } from '@/lib/posts'
import { getPageMetadata } from '@/lib/metadata'
import { stripMarkdown } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = getPageMetadata('about') as Metadata

function getBlogStats() {
  const posts = getAllPosts()
  const totalPosts = posts.length
  const totalCategories = new Set(posts.flatMap(p => p.categories)).size
  const totalTags = new Set(posts.flatMap(p => p.tags)).size
  const totalChars = posts.reduce((sum, p) => sum + stripMarkdown(p.content).length, 0)
  const totalReadingMin = posts.reduce((sum, p) => sum + Math.max(1, Math.ceil(stripMarkdown(p.content).length / 300)), 0)
  const startDate = new Date('2020-04-01')
  const daysRunning = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  return { totalPosts, totalCategories, totalTags, totalChars, totalReadingMin, daysRunning }
}

export default function AboutPage() {
  const timeline = getTimeline()
  const projects = getProjects()
  const skills = getSkills()
  const stats = getBlogStats()

  return (
    <div className="page page-post">
      <h1 className="title">关于我</h1>
      <div className="post post-content">
        <blockquote><p>Hello</p></blockquote>
        
        <h2>相关技能</h2>
        <SkillTree skillCategories={skills} />

        <h2>博客统计</h2>
        <div className="stats-grid">
          {([
            [stats.totalPosts, '文章'],
            [stats.totalChars.toLocaleString(), '总字数'],
            [stats.totalCategories, '分类'],
            [stats.totalTags, '标签'],
            [stats.totalReadingMin, '阅读分钟'],
            [stats.daysRunning, '建站天数'],
          ] as const).map(([value, label]) => (
            <div key={label} className="stat-card">
              <span className="stat-value">{value}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        <h2>经历</h2>
        <div className="timeline">
          {timeline.map((item, i) => (
            <div key={i} className="timeline__item">
              <span className="timeline__year">{item.year}</span>
              <div className="timeline__content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                {(item.url || (item as { link?: string }).link) && (
                  <a href={(item.url || (item as { link?: string }).link)} target="_blank" rel="noopener noreferrer" className="timeline__link">查看详情 &rarr;</a>
                )}
              </div>
            </div>
          ))}
        </div>

        <h2>项目作品集</h2>
        <div className="project-grid">
          {projects.map((project, i) => (
            <a key={i} href={project.url} target="_blank" rel="noopener noreferrer" className="project-card">
              <h3>{project.name}</h3>
              <p>{project.desc}</p>
              <div className="project-tags">
                {project.tags.map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
            </a>
          ))}
        </div>

        <h2>联系我</h2>
        <ul>
          <li>Email: <a href="mailto:sanksu@qq.com">sanksu@qq.com</a></li>
          <li>GitHub: <a href="https://github.com/sanksu" target="_blank" rel="noopener noreferrer">Sanksu</a></li>
        </ul>
      </div>
    </div>
  )
}
