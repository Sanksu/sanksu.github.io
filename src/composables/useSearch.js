import { ref, onMounted, nextTick } from 'vue'
import { getAllPosts } from '@/data/posts'

export function useSearch() {
  const keyword = ref('')
  const results = ref([])
  const loaded = ref(false)

  function stripHtml(str) {
    return str.replace(/<[^>]*>/g, '').replace(/```[\s\S]*?```/g, '').replace(/[#*`\[\]]/g, '').replace(/\s+/g, '')
  }

  function escapeReg(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  function search(key) {
    key = (key || '').trim()
    if (!key) {
      results.value = []
      return
    }

    const allPosts = getAllPosts()
    const reg = new RegExp(escapeReg(key), 'gi')

    results.value = allPosts
      .map(post => {
        const content = stripHtml(post.content)
        const match = reg.exec(content)
        const titleMatch = reg.test(post.title)

        if (!titleMatch && !match) return null

        let excerpt = ''
        if (match) {
          const idx = match.index
          const left = Math.max(0, idx - 10)
          const right = idx + 90
          excerpt = content.substring(left, right) + '...'
        }

        return {
          ...post,
          titleHighlight: titleMatch ? post.title.replace(reg, `<span class="hint">${key}</span>`) : post.title,
          excerpt,
          excerptHighlight: excerpt
            ? excerpt.replace(new RegExp(escapeReg(key), 'gi'), `<span class="hint">${key}</span>`)
            : ''
        }
      })
      .filter(Boolean)
  }

  function handleInput(value) {
    keyword.value = value
    search(value)
  }

  onMounted(() => {
    loaded.value = true
  })

  return { keyword, results, loaded, handleInput, search }
}
