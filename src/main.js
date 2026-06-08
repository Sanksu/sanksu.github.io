import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import existing CSS styles
import '/assets/css/common.css'
import '/assets/css/theme-dark.css'
import '/assets/css/page.css'
import '/assets/css/post.css'
import '/assets/css/code-dark.css'
import '/assets/css/code-light.css'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
