<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import EditorialButton from './EditorialButton.vue'

type WorkAsset = {
  id: string
  src: string
  x: number
  y: number
  width: string
  ratio: string
  depth: number
  phase: number
  rotation: number
  delay: number
}

const sectionElement = ref<HTMLElement | null>(null)

const isRevealReady = ref(false)
const isRevealed = ref(false)
const isInView = ref(false)

let observer: IntersectionObserver | undefined
let rafId: number | undefined

const headlineLines = [
  'A portfolio',
  'built for every',
  'step.',
]

const workAssets: WorkAsset[] = [
  {
    id: '01',
    src: '/images/work-intro/work-intro-01.jpg',
    x: 5,
    y: 10,
    width: '4.6rem',
    ratio: '4 / 5',
    depth: 0.34,
    phase: 0.1,
    rotation: -4,
    delay: 0,
  },
  {
    id: '02',
    src: '/images/work-intro/work-intro-02.jpg',
    x: 20,
    y: 23,
    width: '3.8rem',
    ratio: '1 / 1',
    depth: 0.76,
    phase: 1.1,
    rotation: 2,
    delay: 70,
  },
  {
    id: '03',
    src: '/images/work-intro/work-intro-03.jpg',
    x: 32,
    y: 8,
    width: '4.1rem',
    ratio: '3 / 4',
    depth: 0.43,
    phase: 2.2,
    rotation: -1,
    delay: 130,
  },
  {
    id: '04',
    src: '/images/work-intro/work-intro-04.jpg',
    x: 61,
    y: 12,
    width: '4.5rem',
    ratio: '4 / 5',
    depth: 0.58,
    phase: 0.8,
    rotation: 3,
    delay: 190,
  },
  {
    id: '05',
    src: '/images/work-intro/work-intro-05.jpg',
    x: 85,
    y: 7,
    width: '3.4rem',
    ratio: '1 / 1',
    depth: 0.28,
    phase: 1.8,
    rotation: -2,
    delay: 250,
  },
  {
    id: '06',
    src: '/images/work-intro/work-intro-06.jpg',
    x: 13,
    y: 45,
    width: '4.9rem',
    ratio: '3 / 4',
    depth: 0.66,
    phase: 2.7,
    rotation: 2,
    delay: 310,
  },
  {
    id: '07',
    src: '/images/work-intro/work-intro-07.jpg',
    x: 73,
    y: 34,
    width: '5.5rem',
    ratio: '4 / 5',
    depth: 0.47,
    phase: 0.5,
    rotation: -3,
    delay: 370,
  },
  {
    id: '08',
    src: '/images/work-intro/work-intro-08.jpg',
    x: 88,
    y: 47,
    width: '3.8rem',
    ratio: '1 / 1',
    depth: 0.82,
    phase: 2.4,
    rotation: 2,
    delay: 430,
  },
  {
    id: '09',
    src: '/images/work-intro/work-intro-09.jpg',
    x: 7,
    y: 72,
    width: '4.2rem',
    ratio: '4 / 5',
    depth: 0.38,
    phase: 1.4,
    rotation: -2,
    delay: 490,
  },
  {
    id: '10',
    src: '/images/work-intro/work-intro-10.jpg',
    x: 27,
    y: 70,
    width: '4.8rem',
    ratio: '3 / 4',
    depth: 0.61,
    phase: 2.9,
    rotation: 4,
    delay: 550,
  },
  {
    id: '11',
    src: '/images/work-intro/work-intro-11.jpg',
    x: 47,
    y: 76,
    width: '4.4rem',
    ratio: '1 / 1',
    depth: 0.31,
    phase: 0.7,
    rotation: -1,
    delay: 610,
  },
  {
    id: '12',
    src: '/images/work-intro/work-intro-12.jpg',
    x: 69,
    y: 68,
    width: '4rem',
    ratio: '3 / 4',
    depth: 0.73,
    phase: 1.9,
    rotation: 3,
    delay: 670,
  },
  {
    id: '13',
    src: '/images/work-intro/work-intro-13.jpg',
    x: 88,
    y: 76,
    width: '5rem',
    ratio: '4 / 5',
    depth: 0.45,
    phase: 2.6,
    rotation: -3,
    delay: 730,
  },
  {
    id: '14',
    src: '/images/work-intro/work-intro-14.jpg',
    x: 41,
    y: 43,
    width: '3.4rem',
    ratio: '1 / 1',
    depth: 0.9,
    phase: 1.3,
    rotation: 1,
    delay: 790,
  },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function updateScene() {
  const section = sectionElement.value

  if (!section || !isInView.value) {
    return
  }

  const sectionRect = section.getBoundingClientRect()
  const scrollRange = Math.max(section.offsetHeight - window.innerHeight, 1)

  const progress = clamp(
    -sectionRect.top / scrollRange,
    0,
    1,
  )

  const assets = section.querySelectorAll<HTMLElement>(
    '[data-work-asset]',
  )

  assets.forEach((asset) => {
    const depth = Number(asset.dataset.depth ?? 0.4)
    const phase = Number(asset.dataset.phase ?? 0)

    const fallDistance = 120 + depth * 290
    const verticalDrift = progress * fallDistance

    const horizontalDrift =
      Math.sin(progress * Math.PI * 1.7 + phase) *
      (8 + depth * 18)

    asset.style.setProperty(
      '--work-parallax-x',
      `${horizontalDrift.toFixed(2)}px`,
    )

    asset.style.setProperty(
      '--work-parallax-y',
      `${verticalDrift.toFixed(2)}px`,
    )
  })

  section.style.setProperty(
    '--work-content-drift',
    `${(progress * -12).toFixed(2)}px`,
  )
}

function requestSceneUpdate() {
  if (!isInView.value || rafId !== undefined) {
    return
  }

  rafId = window.requestAnimationFrame(() => {
    rafId = undefined
    updateScene()
  })
}

function handleScroll() {
  requestSceneUpdate()
}

function handleResize() {
  requestSceneUpdate()
}

onMounted(() => {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  if (prefersReducedMotion || !sectionElement.value) {
    isRevealed.value = true
    return
  }

  isRevealReady.value = true

  window.addEventListener('scroll', handleScroll, {
    passive: true,
  })

  window.addEventListener('resize', handleResize)

  const revealSection = () => {
    isInView.value = true
    isRevealed.value = true
    requestSceneUpdate()
  }

  if (!('IntersectionObserver' in window)) {
    revealSection()
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) {
        return
      }

      isInView.value = entry.isIntersecting

      if (entry.isIntersecting) {
        isRevealed.value = true
        requestSceneUpdate()
      }
    },
    {
      threshold: 0,
      rootMargin: '20% 0px 20% 0px',
    },
  )

  observer.observe(sectionElement.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()

  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)

  if (rafId !== undefined) {
    window.cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <section
    ref="sectionElement"
    class="work-intro"
    :class="{
        'work-intro--reveal-ready': isRevealReady,
        'work-intro--revealed': isRevealed,
        'work-intro--mask-visible': isInView,
      }"
    aria-labelledby="work-intro-title"
  >
    <div class="work-intro__top-mask"></div>
    <div class="work-intro__stage">
      <div class="work-intro__assets" aria-hidden="true">
        <div
          v-for="(asset, index) in workAssets"
          :key="asset.id"
          :class="[
            'work-intro__asset',
            `work-intro__asset--${index + 1}`,
          ]"
          :style="{
            '--asset-x': `${asset.x}%`,
            '--asset-y': `${asset.y}%`,
            '--asset-width': asset.width,
            '--asset-ratio': asset.ratio,
            '--asset-rotation': `${asset.rotation}deg`,
            '--asset-delay': `${asset.delay}ms`,
          }"
          :data-depth="asset.depth"
          :data-phase="asset.phase"
          data-work-asset
        >
          <div class="work-intro__asset-frame">
            <div
              class="work-intro__asset-media"
              :style="{
                backgroundImage: `url(${asset.src})`,
              }"
            />
          </div>
        </div>
      </div>

      <div class="work-intro__content">
        <h2 id="work-intro-title" class="work-intro__headline">
          <span
            v-for="(line, index) in headlineLines"
            :key="line"
            class="work-intro__headline-line"
            :style="{ '--line-index': index }"
          >
            {{ line }}
          </span>
        </h2>

        <div class="work-intro__button-reveal">
          <EditorialButton to="/work">
            Explore Our Work
          </EditorialButton>
        </div>
      </div>
    </div>
  </section>
</template>