<template>
  <div class="page page-post scroll-animate">
    <h1 class="title scroll-animate">关于我</h1>
    <div class="post scroll-animate post-content">
      <blockquote>
        <p>Hello</p>
      </blockquote>
      <h2>相关技能</h2>
      <p>别问，问就没有</p>
      <h2>联系我</h2>
      <ul>
        <li>Email: <a href="mailto:sanksu@qq.com">sanksu@qq.com</a></li>
        <li>GitHub: <a href="https://github.com/sanksu" target="_blank">Sanksu</a></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()
</script>
