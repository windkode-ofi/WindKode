<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ServiceItem } from '@/data'

defineProps<{
  service: ServiceItem
  index: number
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="group flex h-full flex-col gap-5 rounded-2xl border border-ink/10 bg-ink/[0.03] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-jade-soft/30 hover:bg-carbon/60"
  >
    <div class="flex items-center justify-between">
      <div
        class="flex size-12 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:text-jade"
      >
        <component :is="service.icon" class="size-6" :stroke-width="1.5" />
      </div>
      <span class="font-display text-2xl text-ink/10 transition-colors group-hover:text-jade/40">
        0{{ index + 1 }}
      </span>
    </div>
    <h3 class="text-lg font-semibold text-ink">{{ t(`servicios.items.${service.key}.titulo`) }}</h3>
    <p class="text-sm leading-relaxed text-silver/60">{{ t(`servicios.items.${service.key}.descripcion`) }}</p>
  </article>
</template>
