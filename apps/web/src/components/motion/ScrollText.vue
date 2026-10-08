<script setup lang="ts">
import { computed, ref } from 'vue'
import { useScrollProgress } from '@/composables/useScrollProgress'

/**
 * Párrafo que se «enciende» palabra a palabra al hacer scroll. Solo se
 * actualiza una variable CSS (`--p`) en el contenedor; cada palabra calcula su
 * opacidad en CSS (`.scroll-word`), así no hay re-render por frame.
 */
const props = withDefaults(defineProps<{ text: string; as?: 'p' | 'h2' | 'div' }>(), { as: 'p' })

const el = ref<HTMLElement | null>(null)
const progress = useScrollProgress(el, [0.85, 0.45])
const words = computed(() => props.text.split(' '))
</script>

<template>
  <component :is="as" ref="el" :style="{ '--p': progress.toFixed(4), '--n': words.length }">
    <span v-for="(word, i) in words" :key="i" class="scroll-word" :style="{ '--i': i }">{{ word }}</span>
  </component>
</template>
