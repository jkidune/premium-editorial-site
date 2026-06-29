<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    tone?: 'light' | 'dark'
    external?: boolean
  }>(),
  {
    tone: 'light',
    external: false,
  },
)

const buttonComponent = computed(() => {
  return props.to ? RouterLink : 'a'
})

const buttonProps = computed(() => {
  if (props.to) {
    return { to: props.to }
  }

  return {
    href: props.href ?? '#',
    ...(props.external
      ? {
          target: '_blank',
          rel: 'noreferrer',
        }
      : {}),
  }
})
</script>

<template>
  <component
    :is="buttonComponent"
    v-bind="buttonProps"
    :class="['editorial-button', `editorial-button--${tone}`]"
  >
    <span class="editorial-button__label">
      <slot />
    </span>

    <span class="editorial-button__arrow" aria-hidden="true">
      →
    </span>
  </component>
</template>