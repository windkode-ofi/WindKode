<script setup lang="ts">
import { RouterView } from 'vue-router'
import { AppNavbar, AppFooter } from '@/components/layout'
</script>

<template>
  <AppNavbar />
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <AppFooter />
</template>
