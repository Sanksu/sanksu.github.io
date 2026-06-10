'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'

const skillCategories = [
  {
    id: 'frontend',
    name: 'FRONTEND',
    skills: [
      { id: 'html-css', name: 'HTML / CSS', level: 7, description: 'Responsive layouts, Flexbox, Grid, animations.' },
      { id: 'js-ts', name: 'JavaScript / TypeScript', level: 6, description: 'ES6+, type safety, async programming.' },
    ],
  },
  {
    id: 'backend',
    name: 'BACKEND',
    skills: [
      { id: 'python', name: 'Python', level: 5, description: 'Scripting, automation, data processing.' },
      { id: 'mysql', name: 'MySQL', level: 5, description: 'Relational database design, query optimization.' },
    ],
  },
  {
    id: 'systems',
    name: 'SYSTEMS',
    skills: [
      { id: 'c-cpp', name: 'C / C++', level: 5, description: 'Low-level programming, memory management.' },
    ],
  },
  {
    id: 'hardware',
    name: 'HARDWARE',
    skills: [
      { id: 'kicad', name: 'KiCad', level: 4, description: 'PCB design, schematic capture.' },
      { id: 'lceda', name: 'LCEDA', level: 4, description: 'EasyEDA / LCEDA circuit design.' },
      { id: 'fusion360', name: 'Fusion 360', level: 3, description: '3D modeling, mechanical design.' },
    ],
  },
  {
    id: 'tools',
    name: 'TOOLS',
    skills: [
      { id: 'git', name: 'Git', level: 6, description: 'Version control, collaboration, branching.' },
      { id: 'linux', name: 'Linux', level: 5, description: 'Shell scripting, server administration.' },
      { id: 'markdown', name: 'Markdown', level: 8, description: 'Technical documentation, note-taking.' },
    ],
  },
]

export default function SkillTree() {
  const [expanded, setExpanded] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [tappedId, setTappedId] = useState(null)
  const [typedText, setTypedText] = useState('')
  const prevDescRef = useRef('')

  const allSkills = useMemo(() => skillCategories.flatMap(c => c.skills), [])
  const activeId = hoveredId ?? tappedId
  const activeSkill = useMemo(
    () => allSkills.find(sk => sk.id === activeId) ?? null,
    [allSkills, activeId],
  )
  const totalLines = useMemo(
    () => skillCategories.reduce((sum, cat) => sum + 1 + cat.skills.length, 0),
    [],
  )

  const handleLeafTap = useCallback((skillId) => {
    setTappedId(prev => (prev === skillId ? null : skillId))
  }, [])

  useEffect(() => {
    const desc = activeSkill?.description ?? ''
    if (desc === prevDescRef.current) return
    prevDescRef.current = desc
    setTypedText('')
    if (!desc) return
    let i = 0
    const timer = setInterval(() => {
      i++
      setTypedText(desc.slice(0, i))
      if (i >= desc.length) clearInterval(timer)
    }, 28)
    return () => clearInterval(timer)
  }, [activeSkill])

  let lineIdx = 0

  return (
    <div className={`skill-tree ${expanded ? 'skill-tree--expanded' : ''}`}>
      <button
        className="skill-tree__toggle"
        onClick={() => setExpanded(prev => !prev)}
      >
        <span className="skill-tree__toggle-icon">{expanded ? '\u25BE' : '\u25B8'}</span>
        <span>技能熟练度 / Skills</span>
        <span className="skill-tree__toggle-count">[{allSkills.length}]</span>
      </button>

      {expanded && (
        <div className="skill-tree__body">
          <div className="skill-tree__left">
            <div className="skill-tree__trunk">
              {skillCategories.map((cat, ci) => {
                const isLastBranch = ci === skillCategories.length - 1
                const branchIdx = lineIdx++
                return (
                  <div
                    key={cat.id}
                    className={`skill-tree__branch ${isLastBranch ? 'skill-tree__branch--last' : ''}`}
                    style={{ '--delay': branchIdx }}
                  >
                    <div className="skill-tree__branch-header">
                      <span className="skill-tree__branch-name">{cat.name}</span>
                      <span className="skill-tree__branch-line">{'\u2500'.repeat(24)}</span>
                      <span className="skill-tree__branch-count">[{cat.skills.length}]</span>
                    </div>
                    <div className="skill-tree__leaves">
                      {cat.skills.map((skill, si) => {
                        const isLastLeaf = si === cat.skills.length - 1
                        const isActive = activeId === skill.id
                        const leafIdx = lineIdx++
                        return (
                          <div
                            key={skill.id}
                            className={`skill-tree__leaf ${isLastLeaf ? 'skill-tree__leaf--last' : ''} ${isActive ? 'skill-tree__leaf--hovered' : ''}`}
                            style={{ '--delay': leafIdx }}
                            onMouseEnter={() => setHoveredId(skill.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => handleLeafTap(skill.id)}
                          >
                            <div className="skill-tree__leaf-row">
                              <span className="skill-tree__leaf-name">{skill.name}</span>
                              <span className="skill-tree__leaf-bar">
                                {Array.from({ length: 10 }, (_, i) => (
                                  <span
                                    key={i}
                                    className={`skill-tree__bar-seg ${i < skill.level ? 'skill-tree__bar-seg--filled' : 'skill-tree__bar-seg--empty'}`}
                                  />
                                ))}
                              </span>
                              <span className="skill-tree__leaf-lvl">{skill.level}</span>
                            </div>
                            {isActive && skill.description && (
                              <div className="skill-tree__leaf-desc-mobile">
                                <span>{typedText}</span>
                                <span className="skill-tree__cursor">▌</span>
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

          <div className="skill-tree__right">
            {activeSkill ? (
              <div className="skill-tree__info-panel" key={activeSkill.id}>
                <div className="skill-tree__info-header">
                  <span className="skill-tree__info-title">{activeSkill.name}</span>
                  <span className="skill-tree__info-level">LV.{activeSkill.level}</span>
                </div>
                <div className="skill-tree__info-body">
                  <span>{typedText}</span>
                  <span className="skill-tree__cursor">▌</span>
                </div>
              </div>
            ) : (
              <div className="skill-tree__info-empty">
                <span>HOVER TO INSPECT</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}