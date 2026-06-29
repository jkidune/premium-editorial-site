import { createApp } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import './style/main.css'
import App from './App.vue'

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches

if (!prefersReducedMotion) {
  new Lenis({
    autoRaf: true,
    duration: 1.1,
    anchors: true,
  })
}

createApp(App).mount('#app')