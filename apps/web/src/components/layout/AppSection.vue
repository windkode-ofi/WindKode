<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  id?: string
}>()
</script>

<template>
  <section :id="id" class="py-20 md:py-28">
    <div class="mx-auto max-w-6xl px-6">
      <div v-if="title || subtitle" class="mb-16 text-center">
        <h2 v-if="title" class="text-3xl font-bold text-ink md:text-4xl">{{ title }}</h2>
        <p v-if="subtitle" class="mt-4 text-lg text-silver/60">{{ subtitle }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>
