<script setup lang="ts">
import { computed, type Component } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { ArrowUpRight } from '@lucide/vue'

const props = withDefaults(
  defineProps<{
    /** Ruta interna (RouterLink). */
    to?: RouteLocationRaw
    /** Enlace externo (wa.me, mailto:, …); si se indica, renderiza un <a> y abre en pestaña nueva. */
    href?: string
    variant?: 'solid' | 'outline'
    size?: 'md' | 'lg'
    icon?: Component
  }>(),
  { to: undefined, href: undefined, variant: 'solid', size: 'md', icon: undefined },
)

const isExternal = computed(() => Boolean(props.href))
const tag = computed(() => (isExternal.value ? 'a' : RouterLink))
const attrs = computed(() =>
  isExternal.value
    ? { href: props.href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: props.to ?? '/' },
)
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="group inline-flex items-center gap-2 rounded-full font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5"
    :class="[
      variant === 'solid' &&
        'btn-shine bg-platinum text-abyss hover:bg-halo hover:shadow-xl hover:shadow-ink/10',
      variant === 'outline' &&
        'border border-ink/15 text-silver hover:border-jade-soft/50 hover:bg-jade/5 hover:text-jade',
      size === 'md' && 'px-5 py-2 text-xs',
      size === 'lg' && 'px-7 py-3.5 text-sm',
    ]"
  >
    <slot />
    <component
      :is="icon ?? ArrowUpRight"
      class="size-4 transition-transform duration-300"
      :class="icon ? 'group-hover:scale-110' : 'group-hover:-translate-y-0.5 group-hover:translate-x-0.5'"
      :stroke-width="2"
    />
  </component>
</template>
