<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { FolderGit2, ArrowUpRight } from '@lucide/vue'
import type { Project } from '@/types/project'
import { AppCard, AppBadge } from '@/components/ui'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>

<template>
  <AppCard hover class="flex h-full flex-col gap-4">
    <div class="flex aspect-video items-center justify-center rounded-lg bg-ink/5 text-steel/60">
      <FolderGit2 class="size-12" :stroke-width="1" />
    </div>

    <div>
      <h3 class="text-lg font-semibold text-ink">{{ project.title }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-silver/60">{{ project.description }}</p>
    </div>

    <div class="mt-auto flex flex-wrap gap-2">
      <AppBadge v-for="tag in project.tags" :key="tag" variant="skill">{{ tag }}</AppBadge>
    </div>

    <div class="flex gap-4">
      <a
        v-if="project.url"
        :href="project.url"
        target="_blank"
        class="inline-flex items-center gap-1 text-sm text-silver transition-colors hover:text-jade"
      >
        {{ t('proyecto.ver') }}
        <ArrowUpRight class="size-3.5" />
      </a>
      <a
        v-if="project.repo"
        :href="project.repo"
        target="_blank"
        class="inline-flex items-center gap-1 text-sm text-steel transition-colors hover:text-silver"
      >
        {{ t('proyecto.repositorio') }}
        <ArrowUpRight class="size-3.5" />
      </a>
    </div>
  </AppCard>
</template>
