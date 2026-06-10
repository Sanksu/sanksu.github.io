import './globals.css'

export const metadata = {
  title: 'Sanksu Blog',
  description: 'Sanksu的个人博客',
  authors: [{ name: 'Sanksu' }],
  keywords: ['Sanksu', 'Blog', 'Java', 'Html', 'JavaScript'],
  icons: {
    icon: '/assets/img/logo.ico',
    apple: '/assets/img/logo_256x256.png',
  },
  other: {
    'theme-color': '#ffffff',
    'supported-color-schemes': 'light dark',
    renderer: 'webkit',
    'applicable-device': 'pc,mobile',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <meta httpEquiv="content-language" content="zh-CN" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Dosis:wght@300;400;500&display=swap" rel="stylesheet" />
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
        {children}
      </body>
    </html>
  )
}
