import { createApp } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import App from './App.vue'
import router from './router'
import './style/main.css'

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches

if (!prefersReducedMotion) {
  new Lenis({
    autoRaf: true,
    anchors: true,
    stopInertiaOnNavigate: true,
  })
}

createApp(App).use(router).mount('#app')