import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import CategoriesPage from '@/views/CategoriesPage.vue'
import SearchPage from '@/views/SearchPage.vue'
import LinksPage from '@/views/LinksPage.vue'
import AboutPage from '@/views/AboutPage.vue'
import PostPage from '@/views/PostPage.vue'

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  { path: '/categories', name: 'Categories', component: CategoriesPage },
  { path: '/search', name: 'Search', component: SearchPage },
  { path: '/about', name: 'About', component: AboutPage },
  { path: '/links', name: 'Links', component: LinksPage },
  { path: '/posts/:year/:month/:day/:slug', name: 'Post', component: PostPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
