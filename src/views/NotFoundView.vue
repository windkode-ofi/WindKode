<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowLeft, CalendarDays } from '@lucide/vue'
import { CtaLink, WLogo } from '@/components/ui'
import { MaskLines } from '@/components/motion'

const { t } = useI18n()
</script>

<template>
  <main class="relative flex min-h-svh items-center overflow-hidden bg-abyss pt-28 text-silver">
    <WLogo
      class="animate-float-x pointer-events-none absolute -right-16 top-1/3 h-64 w-72 text-ink/[0.04] md:h-96 md:w-[26rem]"
    />
    <div class="relative mx-auto w-full max-w-7xl px-6 pb-24">
      <p class="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-steel">{{ t('no_encontrado.kicker') }}</p>
      <MaskLines
        as="h1"
        mode="load"
        :lines="[t('no_encontrado.titulo_l1'), t('no_encontrado.titulo_l2')]"
        line-class="text-metal"
        class="font-display text-[clamp(3.5rem,13vw,10rem)] uppercase leading-[0.9]"
      />
      <p class="mt-8 max-w-md leading-relaxed text-silver/70">{{ t('no_encontrado.texto') }}</p>
      <div class="mt-10 flex flex-col gap-4 sm:flex-row">
        <CtaLink to="/" size="lg" :icon="ArrowLeft" class="justify-center">{{ t('no_encontrado.cta') }}</CtaLink>
        <CtaLink to="/agenda" variant="outline" size="lg" :icon="CalendarDays" class="justify-center">
          {{ t('nav.agenda') }}
        </CtaLink>
      </div>
    </div>
  </main>
</template>
