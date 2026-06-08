<template>
  <footer class="footer">
    <span>Copyright © 2020 - 2024</span>
    <a href="/feed.xml">RSS订阅</a>
    <a href="https://icp.gov.moe/?keyword=20251337" target="_blank">萌ICP备20251337号</a>
    <div class="footer-btn theme-toggler" @click="$emit('toggle-theme')">
      <i class="svg-icon" :class="darkMode ? 'icon-theme-dark' : 'icon-theme-light'"></i>
    </div>
    <div class="footer-btn to-top" @click="scrollToTop">
      <i class="svg-icon icon-arrow-top"></i>
    </div>
  </footer>
</template>

<script setup>
defineProps({ darkMode: Boolean })
defineEmits(['toggle-theme'])

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const show = () => {
  // delegated from App.vue scroll listener
}
</script>
