'use client'

import WalineComments from '@/components/features/WalineComments'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import type { Link } from '@/lib/links'

/**
 * 友链页面内容组件
 * 展示友链列表和本站友链信息，底部嵌入 Waline 评论区
 */
export default function LinksContent({ links }: { links: Link[] }) {
  const ref = useScrollAnimation()

  return (
    <div className="page page-post" ref={ref}>
      <h1 className="title">友情链接</h1>
      <div className="post post-content">
        <p>欢迎各位朋友与我建立友链，如需友链可在此处留言，本站的友链信息如下</p>
        <pre><code>名称：Sanksu Blog<br />
          描述：Sanksu的个人博客<br />
          地址：https://sanksu.cn/<br />
          头像：https://sanksu.cn/static/img/logo.jpg</code></pre>
        {links.length > 0 ? (
          <ul className="link-list">
            {links.map((link, i) => (
              <li key={`${link.url}-${i}`} className="link-card">
                <a href={link.url} title={link.desc} target="_blank" rel="noopener noreferrer">
                  {link.avatar && <img src={link.avatar} alt={link.name} className="link-avatar" loading="lazy" referrerPolicy="no-referrer" />}
                  <div className="link-info">
                    <span className="link-name">{link.name}</span>
                    <span className="link-desc">{link.desc}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>暂无友链，快来成为第一个吧~</p>
        )}
      </div>
      <WalineComments serverURL="https://waline.sanksu.cn/" path="/links" />
    </div>
  )
}
