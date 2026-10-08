<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePortfolioStore } from '@/stores/portfolio.store'
import { SectionHeader } from '@/components/layout'
import { ProjectCard, RevealOnScroll, CtaBanner } from '@/components/shared'

const { t } = useI18n()
const portfolio = usePortfolioStore()

onMounted(() => {
  portfolio.fetchProjects()
})
</script>

<template>
  <main class="min-h-screen bg-abyss pt-28 md:pt-36 text-silver">
    <div class="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          :kicker="t('proyectos.kicker')"
          :title="t('proyectos.titulo')"
          :subtitle="t('proyectos.subtitulo')"
        />
      </RevealOnScroll>

      <div v-if="portfolio.projects.length" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll v-for="(project, i) in portfolio.projects" :key="project.id" :delay="i * 100">
          <ProjectCard :project="project" />
        </RevealOnScroll>
      </div>
      <p v-else class="text-center text-silver/50">{{ t('proyectos.vacio') }}</p>

      <RevealOnScroll :delay="150">
        <CtaBanner class="mt-20" />
      </RevealOnScroll>
    </div>
  </main>
</template>
