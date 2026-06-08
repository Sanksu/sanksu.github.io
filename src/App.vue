<template>
  <div id="app-root">
    <AppHeader />
    <router-view />
    <AppFooter :darkMode="darkMode" @toggle-theme="toggleTheme" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { useTheme } from '@/composables/useTheme'

const { darkMode, toggleTheme } = useTheme()

// Back to top button show/hide
let scrollTimer = null

function onScroll() {
  const el = document.querySelector('.footer-btn.to-top')
  if (!el) return
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  el.classList.toggle('show', scrollTop > 200)
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (scrollTimer) clearTimeout(scrollTimer)
})
</script>
