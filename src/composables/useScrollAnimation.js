import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  let observer = null

  onMounted(() => {
    const items = document.querySelectorAll('.scroll-animate')
    if (items.length === 0) return

    if (!window.IntersectionObserver) {
      items.forEach(el => el.classList.add('scroll-animated'))
      return
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('scroll-animated')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15 })

    items.forEach(el => observer.observe(el))
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
}
