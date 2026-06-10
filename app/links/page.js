'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WalineComments from '@/components/WalineComments'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function LinksPage() {
  const ref = useScrollAnimation()
  const links = []

  return (
    <>
      <Header />
      <div ref={ref}>
        <div className="page page-post">
          <h1 className="title">友情链接</h1>
          <div className="post post-content">
            <p>欢迎各位朋友与我建立友链，如需友链可在此处留言，本站的友链信息如下</p>
            <pre><code>名称：Sanksu Blog<br />
              描述：Sanksu的个人博客<br />
              地址：https://sanksu.cn/<br />
              头像：https://sanksu.cn/static/img/logo.jpg</code></pre>
            <ul>
              {links.map(link => (
                <li key={link.title}>
                  <p><a href={link.url} title={link.desc} target="_blank" rel="noopener noreferrer">{link.title}</a></p>
                </li>
              ))}
            </ul>
          </div>
          <WalineComments serverURL="https://waline.sanksu.cn/" path="/links" />
        </div>
      </div>
      <Footer />
    </>
  )
}
