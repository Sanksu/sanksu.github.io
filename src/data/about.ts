/** 关于页数据（原 _data/timeline.json、projects.json） */

/** 时间线条目 */
export interface TimelineItem {
  year: string
  title: string
  desc: string
  /** 外部链接（兼容旧字段） */
  link?: string
  /** 外部链接（新字段） */
  url?: string
}

/** 项目作品 */
export interface Project {
  name: string
  desc: string
  url: string
  tags: string[]
}

export const timeline: TimelineItem[] = [
  {
    year: '2024',
    title: '开始搭建个人博客',
    desc: '基于 Next.js + Markdown 构建个人博客站点',
  },
  {
    year: '2024',
    title: 'SlimeVR BMI270 硬件项目',
    desc: '设计并开源 SlimeVR 追踪器硬件方案，使用 ESP-12F + BMI270 IMU',
    link: 'https://oshwhub.com/sanksu/slimevr_bmi270',
  },
]

export const projects: Project[] = [
  {
    name: 'Sanksu Blog',
    desc: '基于 Astro 的个人博客，支持 Markdown、代码高亮、RSS 订阅',
    url: 'https://sanksu.cn/',
    tags: ['Astro', 'Markdown'],
  },
  {
    name: 'SlimeVR BMI270',
    desc: 'DIY 全身追踪器硬件方案，开源 PCB 设计与固件配置',
    url: 'https://oshwhub.com/sanksu/slimevr_bmi270',
    tags: ['硬件', 'ESP8266', 'BMI270', '开源'],
  },
]
