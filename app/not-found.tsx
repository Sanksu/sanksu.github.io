import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="page page-404">
      <h1 className="title">404</h1>
      <p>页面未找到，请检查地址是否正确</p>
      <Link href="/" className="back-home">返回首页</Link>
    </div>
  )
}
