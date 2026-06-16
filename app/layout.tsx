import './globals.scss'
import FloatingActions from '@/components/ui/FloatingActions'
import LoadingScreen from '@/components/layout/LoadingScreen'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getSiteMetadata } from '@/lib/metadata'
import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = getSiteMetadata() as Metadata

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta httpEquiv="content-language" content="zh-CN" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link rel="preload" href="/fonts/dosis-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dosis-latin-ext.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/fonts/dosis.css" />
        <link rel="alternate" type="application/rss+xml" title="Sanksu Blog RSS" href="/rss.xml" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var d=document.documentElement;
            var f=localStorage.darkMode;
            if(f==='true')d.className='dark';
            else if(f==='false')d.className='';
            else if(window.matchMedia('(prefers-color-scheme:dark)').matches)d.className='dark';
          })();
        ` }} />
      </head>
      <body>
        <LoadingScreen />
        <Header />
        {children}
        <Footer />
        <FloatingActions />
      </body>
    </html>
  )
}
