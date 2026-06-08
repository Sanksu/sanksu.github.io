import { ref, onMounted, onUnmounted } from 'vue'

export function useTheme() {
  const darkMode = ref(false)

  function initDarkMode(flag) {
    if (flag === 'true') darkMode.value = true
    else if (flag === 'false') darkMode.value = false
    else darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches

    document.documentElement.className = darkMode.value ? 'dark' : ''
    const meta = document.querySelector('meta[name=theme-color]')
    if (meta) {
      meta.setAttribute('content', darkMode.value ? '#2D2E32' : '#FFFFFF')
    }
  }

  function toggleTheme() {
    const flag = darkMode.value ? 'false' : 'true'
    localStorage.darkMode = flag
    initDarkMode(flag)
  }

  function handleThemeChange(ev) {
    if (ev.matches !== darkMode.value) {
      localStorage.darkMode = ''
      initDarkMode(ev.matches ? 'true' : 'false')
    }
  }

  let mq = null

  onMounted(() => {
    initDarkMode(localStorage.darkMode)
    mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', handleThemeChange)
  })

  onUnmounted(() => {
    if (mq) mq.removeEventListener('change', handleThemeChange)
  })

  return { darkMode, toggleTheme, initDarkMode }
}
