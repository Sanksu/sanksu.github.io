'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import styles from './SkillTree.module.scss'
import { useTypingEffect } from '@/hooks/useTypingEffect'

interface Skill {
  id: string
  name: string
  level: number
  description: string
}

interface SkillCategory {
  id: string
  name: string
  skills: Skill[]
}

interface Props {
  /** 技能分类与具体技能数据 */
  skillCategories: SkillCategory[]
}

/**
 * 技能树组件
 * 以树状结构展示技能分类和熟练度，支持展开/收起、悬停/点击查看详情
 * - 左侧：可折叠的技能分支树，每片叶子显示名称、10 格进度条和等级
 * - 右侧：当前选中技能的详细信息面板，带打字机动画
 */
export default function SkillTree({ skillCategories }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [closing, setClosing] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [tappedId, setTappedId] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allSkills = useMemo(() => skillCategories.flatMap(c => c.skills), [skillCategories])

  /** 当前活动技能：优先悬停，其次点击 */
  const activeId = hoveredId ?? tappedId
  const activeSkill = useMemo(
    () => allSkills.find(sk => sk.id === activeId) ?? null,
    [allSkills, activeId],
  )

  // 打字机动画
  const typedText = useTypingEffect(activeSkill?.description ?? '')

  // 预计算所有分支和叶子的延迟索引，确保渲染一致性
  const delayIndices = useMemo(() => {
    const indices: Map<string, number> = new Map()
    let idx = 0
    skillCategories.forEach(cat => {
      indices.set(`branch-${cat.id}`, idx++)
      cat.skills.forEach(skill => {
        indices.set(`leaf-${skill.id}`, idx++)
      })
    })
    return indices
  }, [skillCategories])

  /** 处理叶子点击（移动端适配） */
  const handleLeafTap = useCallback((skillId: string) => {
    setTappedId(prev => (prev === skillId ? null : skillId))
  }, [])

  /** 展开/收起技能树 */
  const toggle = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    if (expanded) {
      setClosing(true)
      setExpanded(false)
      closeTimer.current = setTimeout(() => {
        setClosing(false)
        setRendered(false)
      }, 250)
    } else {
      setRendered(true)
      setClosing(false)
      // rAF ensures the DOM is painted before animation starts
      requestAnimationFrame(() => setExpanded(true))
    }
  }

  return (
    <div className={`${styles.tree} ${expanded ? styles.expanded : ''}`}>
      <button className={styles.toggle} onClick={toggle}>
        <span className={styles.toggleIcon}>{expanded ? '\u25BE' : '\u25B8'}</span>
        <span>技能熟练度 / Skills</span>
        <span className={styles.toggleCount}>[{allSkills.length}]</span>
      </button>

      {(rendered || closing) && (
        <div className={`${styles.body} ${expanded ? styles.bodyEnter : ''} ${closing ? styles.bodyExit : ''}`}>
          <div className={styles.left}>
            <div className={styles.trunk}>
              {skillCategories.map((cat) => {
                const branchIdx = delayIndices.get(`branch-${cat.id}`) ?? 0
                return (
                  <div key={cat.id} className={styles.branch} style={{ ['--delay' as string]: branchIdx }}>
                    <div className={styles.branchHeader}>
                      <span className={styles.branchName}>{cat.name}</span>
                      <span className={styles.branchLine}>{'\u2500'.repeat(24)}</span>
                      <span className={styles.branchCount}>[{cat.skills.length}]</span>
                    </div>
                    <div>
                      {cat.skills.map((skill) => {
                        const isActive = activeId === skill.id
                        const leafIdx = delayIndices.get(`leaf-${skill.id}`) ?? 0
                        return (
                          <div
                            key={skill.id}
                            className={`${styles.leaf} ${isActive ? styles.hovered : ''}`}
                            style={{ ['--delay' as string]: leafIdx }}
                            onMouseEnter={() => setHoveredId(skill.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => handleLeafTap(skill.id)}
                          >
                            <div className={styles.leafRow}>
                              <span className={styles.leafName}>{skill.name}</span>
                              <span className={styles.leafBar}>
                                {Array.from({ length: 10 }, (_, i) => (
                                  <span key={i} className={`${styles.barSeg} ${i < skill.level ? styles.barSegFilled : styles.barSegEmpty}`} />
                                ))}
                              </span>
                              <span className={styles.leafLevel}>{skill.level}</span>
                            </div>
                            {isActive && skill.description && (
                              <div className={styles.leafDesc}>
                                <span>{typedText}</span>
                                <span className={styles.cursor}>▌</span>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className={styles.right}>
            {activeSkill ? (
              <div className={styles.infoPanel} key={activeSkill.id}>
                <div className={styles.infoHeader}>
                  <span className={styles.infoTitle}>{activeSkill.name}</span>
                  <span className={styles.infoLevel}>LV.{activeSkill.level}</span>
                </div>
                <div className={styles.infoBody}>
                  <span>{typedText}</span>
                  <span className={styles.cursor}>▌</span>
                </div>
              </div>
            ) : (
              <div className={styles.infoEmpty}>
                <span>HOVER TO INSPECT</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
