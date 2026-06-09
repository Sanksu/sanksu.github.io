<template>
  <div class="page page-404 scroll-animate">
    <h1 class="title scroll-animate">404</h1>
    <p class="scroll-animate">页面未找到，请检查地址是否正确</p>
    <router-link to="/" class="back-home scroll-animate">返回首页</router-link>
  </div>
</template>

<script setup>
import { useScrollAnimation } from '@/composables/useScrollAnimation'

useScrollAnimation()
</script>

<style scoped>
.page-404 {
  text-align: center;
  padding-top: 80px;
  padding-bottom: 80px;
}
.page-404 .title {
  font-size: 6rem;
  font-weight: 300;
  margin-bottom: 16px;
  color: var(--ark-highlight);
}
.page-404 p {
  color: var(--ark-text-dim);
  margin-bottom: 32px;
}
.back-home {
  color: var(--ark-text);
  border-bottom: 1px solid var(--ark-border);
  transition: all var(--transition-fast);
}
.back-home:hover {
  color: var(--ark-highlight);
  border-bottom-color: var(--ark-highlight);
}
</style>
