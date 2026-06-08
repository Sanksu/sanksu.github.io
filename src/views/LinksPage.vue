<template>
  <div class="page page-post scroll-animate">
    <h1 class="title scroll-animate">友情链接</h1>
    <div class="post scroll-animate post-content">
      <p>欢迎各位朋友与我建立友链，如需友链可在此处留言，本站的友链信息如下</p>
      <pre><code>名称：Sanksu Blog
描述：Sanksu的个人博客
地址：https://sanksu.cn/
头像：https://sanksu.cn/static/img/logo.jpg</code></pre>
      <ul>
        <li v-for="link in links" :key="link.title">
          <p><a :href="link.url" :title="link.desc" target="_blank">{{ link.title }}</a></p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const links = []

useScrollAnimation()
</script>
