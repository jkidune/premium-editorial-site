import { ref } from 'vue'

function shouldPlayIntro() {
  if (typeof window === 'undefined') {
    return false
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  return window.location.pathname === '/' && !prefersReducedMotion
}

const introShouldPlay = shouldPlayIntro()

const isIntroActive = ref(introShouldPlay)
const isSiteReady = ref(!introShouldPlay)

export function useSiteIntro() {
  function completeIntro() {
    isIntroActive.value = false
    isSiteReady.value = true
  }

  return {
    isIntroActive,
    isSiteReady,
    completeIntro,
  }
}