<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppNavbar, AppFooter } from '@/components/layout'
import { ScrollProgress } from '@/components/motion'
import { useSeo } from '@/composables/useSeo'
import { useSmoothScroll } from '@/composables/useSmoothScroll'

useSeo()
useSmoothScroll()
</script>

<template>
  <ScrollProgress />
  <AppNavbar />
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <AppFooter />
</template>
