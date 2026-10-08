<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TeamAreaItem } from '@/data'

defineProps<{
  area: TeamAreaItem
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="group flex h-full flex-col gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-jade-soft/30 hover:bg-carbon/60"
  >
    <div
      class="flex size-11 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10 group-hover:text-jade"
    >
      <component :is="area.icon" class="size-5" :stroke-width="1.5" />
    </div>
    <div>
      <h3 class="text-base font-semibold text-ink">
        {{ t(`equipo.areas.${area.key}.titulo`) }}
      </h3>
      <p class="mt-2 text-sm leading-relaxed text-silver/60">
        {{ t(`equipo.areas.${area.key}.descripcion`) }}
      </p>
    </div>
  </article>
</template>
