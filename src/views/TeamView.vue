<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SectionHeader } from '@/components/layout'
import { RevealOnScroll, TeamCard, TeamAreaCard, CtaBanner } from '@/components/shared'
import { team, teamAreas } from '@/data'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen bg-abyss pt-28 md:pt-36 text-silver">
    <div class="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      <RevealOnScroll>
        <SectionHeader :kicker="t('equipo.kicker')" :title="t('equipo.titulo')" :subtitle="t('equipo.subtitulo')" />
      </RevealOnScroll>

      <div class="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
        <RevealOnScroll v-for="(member, i) in team" :key="member.name" :delay="i * 120">
          <TeamCard :member="member" />
        </RevealOnScroll>
      </div>

      <section class="mt-24 md:mt-32">
        <RevealOnScroll>
          <SectionHeader
            :kicker="t('equipo.areas.kicker')"
            :title="t('equipo.areas.titulo')"
            :subtitle="t('equipo.areas.subtitulo')"
          />
        </RevealOnScroll>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <RevealOnScroll v-for="(area, i) in teamAreas" :key="area.key" :delay="i * 100">
            <TeamAreaCard :area="area" />
          </RevealOnScroll>
        </div>
      </section>

      <RevealOnScroll :delay="150">
        <CtaBanner class="mt-20" />
      </RevealOnScroll>
    </div>
  </main>
</template>
