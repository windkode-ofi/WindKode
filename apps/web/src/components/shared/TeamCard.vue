<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WLogo } from '@/components/ui'
import type { TeamMember } from '@/data'

defineProps<{
  member: TeamMember
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="group flex h-full flex-col items-center gap-5 rounded-2xl border border-ink/10 bg-ink/[0.03] p-10 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-jade-soft/30 hover:bg-carbon/60"
  >
    <div
      class="flex size-24 items-center justify-center rounded-full border border-ink/10 bg-gradient-to-b from-carbon to-graphite font-display text-3xl tracking-widest text-silver transition-transform duration-300 group-hover:scale-105"
    >
      {{ member.initials }}
    </div>
    <div>
      <h3 class="text-lg font-semibold text-ink">{{ member.name }}</h3>
      <p class="mt-1 text-xs uppercase tracking-[0.2em] text-silver/50">{{ t(member.roleKey) }}</p>
    </div>
    <WLogo class="h-5 w-6 text-steel/50 transition-colors group-hover:text-jade-soft" />
  </article>
</template>
