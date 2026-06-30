<script setup lang="ts">
withDefaults(
  defineProps<{
    href: string
    type?: string
    title: string
  }>(),
  {
    type: 'PDF',
  },
)
</script>

<template>
  <a
    class="document-card"
    :href="href"
    target="_blank"
    rel="noreferrer"
    :aria-label="`${title} — opens in a new tab`"
  >
    <span class="document-card__type">
      .{{ type }}
    </span>

    <span class="document-card__footer">
      <span class="document-card__title">
        {{ title }}
      </span>

      <svg
        class="document-card__icon"
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
    </span>
  </a>
</template>