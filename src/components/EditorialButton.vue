<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

type ButtonVariant = 'primary' | 'secondary' | 'inverse'
type ButtonSize = 'regular' | 'compact'
type ButtonIcon = 'arrow' | 'external'

const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    variant?: ButtonVariant
    size?: ButtonSize
    icon?: ButtonIcon
    external?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'regular',
    icon: 'arrow',
    external: false,
  },
)

const buttonComponent = computed(() => {
  return props.to ? RouterLink : 'a'
})

const buttonBindings = computed(() => {
  if (props.to) {
    return {
      to: props.to,
    }
  }

  return {
    href: props.href ?? '#',
    target: props.external ? '_blank' : undefined,
    rel: props.external ? 'noreferrer' : undefined,
  }
})
</script>

<template>
  <component
    :is="buttonComponent"
    v-bind="buttonBindings"
    :class="[
      'editorial-button',
      `editorial-button--${variant}`,
      `editorial-button--${size}`,
    ]"
  >
    <span class="editorial-button__label">
      <slot />
    </span>

    <span
      v-if="icon === 'arrow'"
      class="editorial-button__icon"
      aria-hidden="true"
    >
      →
    </span>

    <svg
      v-else
      class="editorial-button__external-icon"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.5 3.5H16.5V8.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 4L9 11"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M8.5 5H5.5C4.67 5 4 5.67 4 6.5V14.5C4 15.33 4.67 16 5.5 16H13.5C14.33 16 15 15.33 15 14.5V11.5"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </component>
</template>