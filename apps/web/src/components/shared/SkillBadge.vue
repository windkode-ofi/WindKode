<script setup lang="ts">
import type { Skill } from '@/types/project'
import { AppBadge } from '@/components/ui'

defineProps<{
  skill: Skill
}>()
</script>

<template>
  <AppBadge variant="skill">
    {{ skill.name }}
  </AppBadge>
</template>
