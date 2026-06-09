<template>
  <div class="page page-post" v-if="post">
    <h1 class="title scroll-animate">{{ post.title }}</h1>
    <div class="subtitle scroll-animate">
      <span>Sanksu 于 {{ post.date }} 发布</span>
      <span v-if="postview">阅读量: <span class="waline-pageview-count" :data-path="postPath" /></span>
    </div>
    <div class="post scroll-animate post-content" v-html="renderedContent"></div>
    <div id="waline" ref="walineRef"></div>
    <WalineComments serverURL="https://waline.sanksu.cn/" />
  </div>
  <div v-else class="page page-post">
    <h1 class="title">文章未找到</h1>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPostBySlug } from '@/data/posts'
import { useScrollAnimation } from '@/composables/useScrollAnimation'
import { useTheme } from '@/composables/useTheme'
import { marked } from 'marked'
import WalineComments from '@/components/WalineComments.vue'

const route = useRoute()
const post = ref(null)
const walineRef = ref(null)
const { darkMode } = useTheme()

const postview = true

const postPath = computed(() => {
  if (!post.value) return ''
  const [y, m, d] = post.value.date.split('-')
  return `/posts/${y}/${m}/${d}/${post.value.slug}`
})

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked(post.value.content, { breaks: true })
})

function loadPost() {
  const { slug } = route.params
  post.value = getPostBySlug(slug)
}

// Image preview functionality
function initImagePreview() {
  const imgs = document.querySelectorAll('.post-content img')
  if (!imgs.length) return

  let origin = null
  let restoreLock = false

  function toCenter() {
    if (!origin) return
    let w = Math.min(origin.naturalWidth, document.documentElement.clientWidth * 0.9)
    let h = (w * origin.naturalHeight) / origin.naturalWidth
    if (window.innerHeight * 0.95 < h) {
      h = Math.min(origin.naturalHeight, window.innerHeight * 0.95)
      w = (h * origin.naturalWidth) / origin.naturalHeight
    }
    const el = document.querySelector('.img-move-item')
    if (!el) return
    el.style.left = (document.documentElement.clientWidth - w) / 2 + 'px'
    el.style.top = (window.innerHeight - h) / 2 + 'px'
    el.style.width = w + 'px'
    el.style.height = h + 'px'
  }

  function restore() {
    if (restoreLock) return
    restoreLock = true
    const bg = document.querySelector('.img-move-bg')
    const el = document.querySelector('.img-move-item')
    if (bg) bg.style.opacity = '0'
    if (el) {
      el.style.opacity = '0'
      el.style.left = origin.x + 'px'
      el.style.top = origin.y + 'px'
      el.style.width = origin.width + 'px'
      el.style.height = origin.height + 'px'
    }
    setTimeout(() => {
      const b = document.querySelector('.img-move-bg')
      const e = document.querySelector('.img-move-item')
      if (b) b.remove()
      if (e) e.remove()
      restoreLock = false
      origin = null
    }, 300)
  }

  function onClick(e) {
    origin = e.target
    const bg = document.createElement('div')
    bg.className = 'img-move-bg'
    const el = document.createElement('img')
    el.className = 'img-move-item'
    el.src = origin.src
    el.style.left = origin.x + 'px'
    el.style.top = origin.y + 'px'
    el.style.width = origin.width + 'px'
    el.style.height = origin.height + 'px'
    bg.onclick = restore
    el.onclick = restore
    document.body.appendChild(bg)
    document.body.appendChild(el)
    requestAnimationFrame(() => {
      bg.style.opacity = '0.5'
      el.style.opacity = '1'
      toCenter()
    })
  }

  imgs.forEach(img => {
    img.addEventListener('click', onClick, true)
  })
}

// Heading anchor click
function initAnchorClick() {
  document.querySelectorAll('.post h1, .post h2').forEach(el => {
    el.addEventListener('click', function () {
      this.scrollIntoView({ block: 'start' })
      if (this.id && history.replaceState) {
        history.replaceState({}, '', '#' + this.id)
      }
    })
  })
}

// Table wrapping
function initTableWrap() {
  document.querySelectorAll('.post-content table').forEach(table => {
    if (!table.parentNode.classList.contains('table-container')) {
      const wrap = document.createElement('div')
      wrap.className = 'table-container'
      table.parentNode.insertBefore(wrap, table)
      wrap.appendChild(table)
    }
  })
}

// Waline comments
function initWaline() {
  if (!walineRef.value) return
  // Only initialize Waline once
  if (walineRef.value._initialized) return
  walineRef.value._initialized = true

  import('https://unpkg.com/@waline/client@v3/dist/waline.js').then(({ init }) => {
    init({
      el: '#waline',
      serverURL: 'https://waline.sanksu.cn/',
      pageview: true,
      dark: 'html[class="dark"]',
      search: false,
      emoji: [
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/BangDream/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Popipa/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Afterglow/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/RAS/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/PastelPalettes/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/Mygo/',
        '//cdn.jsdelivr.net/gh/Sanksu/Waline_Bang_Dream_emoji@1.9.0/src/AveMujica/',
      ],
    })
  })
}

// Window resize for image preview
window.addEventListener('resize', () => {
  const bg = document.querySelector('.img-move-bg')
  if (bg) {
    // Re-center
    const originEl = document.querySelector('.img-move-item')
    if (originEl && origin) {
      let w = Math.min(origin.naturalWidth, document.documentElement.clientWidth * 0.9)
      let h = (w * origin.naturalHeight) / origin.naturalWidth
      if (window.innerHeight * 0.95 < h) {
        h = Math.min(origin.naturalHeight, window.innerHeight * 0.95)
        w = (h * origin.naturalWidth) / origin.naturalHeight
      }
      originEl.style.left = (document.documentElement.clientWidth - w) / 2 + 'px'
      originEl.style.top = (window.innerHeight - h) / 2 + 'px'
      originEl.style.width = w + 'px'
      originEl.style.height = h + 'px'
    }
  }
})

watch(() => route.params, () => {
  loadPost()
}, { immediate: true })

watch(post, () => {
  if (post.value) {
    // Wait for DOM to update
    setTimeout(() => {
      initImagePreview()
      initAnchorClick()
      initTableWrap()
      initWaline()
    }, 100)
  }
})

useScrollAnimation()
</script>
