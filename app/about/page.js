import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SkillTree from '@/components/SkillTree'

export default function AboutPage() {
  return (
    <>
      <Header />
      <div className="page page-post">
        <h1 className="title">关于我</h1>
        <div className="post post-content">
          <blockquote>
            <p>Hello</p>
          </blockquote>
          <h2>相关技能</h2>
          <SkillTree />
          <h2>联系我</h2>
          <ul>
            <li>Email: <a href="mailto:sanksu@qq.com">sanksu@qq.com</a></li>
            <li>GitHub: <a href="https://github.com/sanksu" target="_blank" rel="noopener noreferrer">Sanksu</a></li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  )
}
