import { createApp } from 'vue'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

import App from './App.vue'
import router from './router'
import './style/main.css'

const defaultDocumentTitle = 'Wolverine'

function updateDocumentTitle() {
  document.title = document.hidden
    ? 'Please come back...'
    : defaultDocumentTitle
}

updateDocumentTitle()
document.addEventListener('visibilitychange', updateDocumentTitle)

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
