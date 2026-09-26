<script setup lang="ts">
import { ref } from 'vue'
import { useIntersectionObserver } from '@/composables/useIntersectionObserver'

const props = defineProps<{
  delay?: number
}>()

const el = ref<HTMLElement | null>(null)
const { isVisible } = useIntersectionObserver(() => el.value, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px',
})

const style = { '--reveal-delay': `${props.delay ?? 0}ms` }
</script>

<template>
  <div ref="el" class="reveal" :class="{ 'is-visible': isVisible }" :style="style">
    <slot />
  </div>
</template>
