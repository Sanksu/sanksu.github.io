// .vuepress/config.ts
import { defineUserConfig } from "vuepress";
import { hopeTheme } from "vuepress-theme-hope";
import { searchPlugin } from "@vuepress/plugin-search";

export default defineUserConfig({
  title: "Sanksu's Blog",
  dest: 'public',
  base: '/',
  shouldPrefetch: false,
  plugins: [
    searchPlugin({
      // 你的选项
    }),
  ],

  // 站点选项
  lang: "zh-CN",

  theme: hopeTheme({
    iconAssets: "iconfont",

    // 主题选项
//    logo: "/logo.jpg",

    hostname: "https://sanksu.top",

    author: {
      name: "Sanksu",
      url: "https://sanksu.top",
    },

    blog: {
      name: "Sanksu",
      avatar:"/logo.jpg",
      description: "平凡学生",
      intro: "/about",
      roundAvatar: true,
      medias: {
        Email: "mailto:sanksu@qq.com",
        Github: "https://github.com/Sanksu",
        Steam: "https://steamcommunity.com/profiles/76561198273837928/",
        Rss: "/rss.xml",
      },
      timeline: "路漫漫其修远兮~",
      articlePerPage: 8,
      articleInfo: ["Date", "PageView", "Category", "Tag",], 
    },

    navbar: [
      "/",
      {
        text: "文章",
        icon: "note",
        link:"/article/",
      },
      {
        text: "代码笔记",
        icon: "code",
        prefix: "/note/",
        children: [
          {
            text: "语言",
            children: [
              "C/",
              "Python/"
            ],
          },
//          {
//            text: "其他",
//           children: ["life/", "poem/"],
//          },
//          "node-js/",
        ],
      },
      {
        text: "关于",
        icon: "profile",
        link: "/about/",
      }
    ],

    // 是否在导航栏内显示仓库链接
    repoLabel: "GitLab",
    repo: "Sanksu/sanksu.gitlab.io",
    repoDisplay: false,

    // 主题色选择器
//    themeColor: {
//      blue: "#2196f3",
//     red: "#f26d6d",
//      green: "#3eaf7c",
//      orange: "#fb9b5f",
//    },
    
    // 深色模式
    darkmode: "toggle",
    
    // 全屏模式
    fullscreen: false,

    displayFooter: true,
    footer:'<a href="/about/site/">About this site</a>',
    copyright: "MIT Licensed | Copyright © 2020-present Sanksu",

    plugins: {
      blog: true,
      comment: {
        provider: "Waline",
        serverURL: "https://waline.sanksu.top",
      },
  
      components: ["BiliBili"],
  
      feed: {
        atom: true,
        json: true,
        rss: true,
      },
  
      mdEnhance: {
        align: true,
        codetabs: true,
        demo: true,
        flowchart: true,
        footnote: true,
        imageMark: true,
        katex: true,
        mermaid: true,
        presentation: true,
        sub: true,
        sup: true,
        vpre: true,
      },
  
      pwa: {
        favicon: "/favicon.ico",
        themeColor: "#5c92d1",
        cacheHTML: false,
        maxSize: 3072,
        apple: {
          icon: "/assets/icon/apple-touch-icon.png",
          statusBarColor: "white",
        },
        msTile: {
          image: "/assets/icon/ms-icon-144.png",
          color: "#ffffff",
        },
        manifest: {
          name: "Mr.Hope 的个人博客",
          short_name: "Mr.Hope Blog",
          description: "Mr.Hope 的个人博客",
          theme_color: "#5c92d1",
          icons: [
            {
              src: "/assets/icon/chrome-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/assets/icon/chrome-512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/assets/icon/chrome-mask-192.png",
              sizes: "192x192",
              purpose: "maskable",
              type: "image/png",
            },
            {
              src: "/assets/icon/chrome-mask-512.png",
              sizes: "512x512",
              purpose: "maskable",
              type: "image/png",
            },
          ],
          shortcuts: [
            {
              name: "分类",
              short_name: "分类",
              icons: [
                {
                  src: "/assets/icon/category-maskable.png",
                  sizes: "192x192",
                  purpose: "maskable",
                  type: "image/png",
                },
                {
                  src: "/assets/icon/category-monochrome.png",
                  sizes: "192x192",
                  purpose: "monochrome",
                  type: "image/png",
                },
              ],
              url: "/category/",
              description: "文章分类分组",
            },
            {
              name: "标签",
              short_name: "标签",
              icons: [
                {
                  src: "/assets/icon/tag-maskable.png",
                  sizes: "192x192",
                  purpose: "maskable",
                  type: "image/png",
                },
                {
                  src: "/assets/icon/tag-monochrome.png",
                  sizes: "192x192",
                  purpose: "monochrome",
                  type: "image/png",
                },
              ],
              url: "/tag/",
              description: "文章标签分组",
            },
            {
              name: "时间线",
              short_name: "时间线",
              icons: [
                {
                  src: "/assets/icon/timeline-maskable.png",
                  sizes: "192x192",
                  purpose: "maskable",
                  type: "image/png",
                },
                {
                  src: "/assets/icon/timeline-monochrome.png",
                  sizes: "192x192",
                  purpose: "monochrome",
                  type: "image/png",
                },
              ],
              url: "/timeline/",
              description: "时间线文章列表",
            },
            {
              name: "个人介绍",
              short_name: "个人介绍",
              icons: [
                {
                  src: "/assets/icon/about-maskable.png",
                  sizes: "192x192",
                  purpose: "maskable",
                  type: "image/png",
                },
                {
                  src: "/assets/icon/about-monochrome.png",
                  sizes: "192x192",
                  purpose: "monochrome",
                  type: "image/png",
                },
              ],
              url: "/about/",
              description: "个人介绍",
            },
          ],
        },
      },
    },
  }),
});

