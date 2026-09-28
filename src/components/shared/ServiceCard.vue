<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { TiltCard } from '@/components/motion'
import type { ServiceItem } from '@/data'

defineProps<{
  service: ServiceItem
  index: number
}>()

const { t } = useI18n()
</script>

<template>
  <TiltCard>
    <article
      class="group flex h-full min-h-72 flex-col gap-5 overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.03] p-8 transition-colors duration-500 hover:border-jade-soft/30 hover:bg-carbon/60"
    >
      <div class="flex items-center justify-between">
        <div
          class="flex size-12 items-center justify-center rounded-full border border-ink/10 bg-abyss text-silver transition-[color,border-color,rotate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[360deg] group-hover:border-jade-soft/40 group-hover:text-jade"
        >
          <component :is="service.icon" class="size-6" :stroke-width="1.5" />
        </div>
        <span class="font-display text-2xl text-ink/10 transition-colors group-hover:text-jade/40">
          0{{ index + 1 }}
        </span>
      </div>
      <div class="mt-auto">
        <h3 class="text-lg font-semibold text-ink">{{ t(`servicios.items.${service.key}.titulo`) }}</h3>
        <p class="mt-3 text-sm leading-relaxed text-silver/60">{{ t(`servicios.items.${service.key}.descripcion`) }}</p>
        <span
          class="mt-6 block h-px w-0 bg-jade-soft transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
        />
      </div>
    </article>
  </TiltCard>
</template>
