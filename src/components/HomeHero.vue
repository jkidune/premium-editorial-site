<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { useSiteIntro } from '../composables/useSiteIntro'

const heroElement = ref<HTMLElement | null>(null)
const mediaElement = ref<HTMLElement | null>(null)
const heroImage = ref<HTMLImageElement | null>(null)
const loaderElement = ref<HTMLElement | null>(null)
const imageUnavailable = ref(false)

const { isIntroActive, completeIntro } = useSiteIntro()

let animationContext: gsap.Context | undefined

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds)
  })
}

async function waitForImage(image: HTMLImageElement) {
  if (!image.complete) {
    await new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true })
      image.addEventListener('error', () => resolve(), { once: true })
    })
  }

  try {
    await image.decode()
  } catch {
    // The animation still runs if decoding is unavailable.
  }
}

function handleImageError() {
  imageUnavailable.value = true
}

onMounted(async () => {
  if (!isIntroActive.value) {
    return
  }

  await nextTick()

  if (heroImage.value) {
    await Promise.race([
      waitForImage(heroImage.value),
      wait(2400),
    ])
  }

  if (!heroElement.value || !mediaElement.value) {
    completeIntro()
    return
  }

  animationContext = gsap.context(() => {
    const revealItems = Array.from(
      heroElement.value?.querySelectorAll<HTMLElement>('[data-intro-item]') ?? [],
    )

    gsap.set(mediaElement.value, {
      scale: 0.38,
      borderRadius: '1.25rem',
      transformOrigin: '50% 100%',
    })

    gsap.set(revealItems, {
      autoAlpha: 0,
      yPercent: 110,
    })

    const timeline = gsap.timeline({
      onComplete: completeIntro,
    })

    timeline
      .to(
        mediaElement.value,
        {
          scale: 1,
          borderRadius: 0,
          duration: 1.55,
          ease: 'power4.inOut',
        },
        0,
      )
      .to(
        loaderElement.value,
        {
          autoAlpha: 0,
          y: -16,
          duration: 0.4,
          ease: 'power2.out',
        },
        0.68,
      )
      .to(
        revealItems,
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power4.out',
        },
        0.95,
      )
  }, heroElement.value)
})

onBeforeUnmount(() => {
  animationContext?.revert()
})
</script>

<template>
  <section
    ref="heroElement"
    class="home-hero"
    :class="{ 'home-hero--intro-active': isIntroActive }"
  >
    <div ref="mediaElement" class="home-hero__media">
      <img
        v-show="!imageUnavailable"
        ref="heroImage"
        src="/images/Glowing Light Trails.png"
        alt=""
        fetchpriority="high"
        @error="handleImageError"
      />
    </div>

    <div class="home-hero__overlay" />

    <div
      v-if="isIntroActive"
      ref="loaderElement"
      class="home-hero__loader"
      aria-live="polite"
    >
      <span>Loading</span>
      <span>01 / 01</span>
    </div>

    <div class="home-hero__content">
      <p data-intro-item class="home-hero__eyebrow">
        (01) / Homepage
      </p>

      <h1 class="home-hero__title">
        <span data-intro-item>Hero</span>
      </h1>

      <aside data-intro-item class="home-hero__feature">
        <div class="home-hero__feature-media" />

        <div class="home-hero__feature-content">
          <span>Featured Block</span>
          <strong>Placeholder</strong>
          <span aria-hidden="true">↗</span>
        </div>
      </aside>
    </div>
  </section>
</template>