<script setup lang="ts">
// Logo de marca inlined para que herede currentColor del contenedor
import logoRaw from '@/assets/svg/W-logo.svg?raw'
</script>

<template>
  <span class="block [&>svg]:h-full [&>svg]:w-full" v-html="logoRaw" />
</template>
