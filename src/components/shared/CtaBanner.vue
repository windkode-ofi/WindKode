<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CalendarDays } from '@lucide/vue'
import { CtaLink, WLogo, WhatsAppIcon } from '@/components/ui'
import { useContact } from '@/composables/useContact'

const { t } = useI18n()
const { whatsappHref } = useContact()
</script>

<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-carbon via-graphite to-abyss px-6 py-12 text-center sm:px-8 sm:py-16 md:px-16"
  >
    <WLogo class="pointer-events-none absolute -right-10 -top-10 h-40 w-44 rotate-12 text-ink/[0.04]" />
    <p class="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-steel">{{ t('agenda.kicker') }}</p>
    <h2 class="font-display leading-[0.95]">
      <span class="text-metal block text-4xl uppercase sm:text-5xl md:text-7xl">{{ t('agenda.titulo_l1') }}</span>
      <span class="text-metal block text-4xl uppercase sm:text-5xl md:text-7xl">{{ t('agenda.titulo_l2') }}</span>
    </h2>
    <p class="mx-auto mt-6 max-w-md leading-relaxed text-silver/70">{{ t('agenda.subtitulo') }}</p>
    <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
      <CtaLink to="/agenda" size="lg" :icon="CalendarDays" class="justify-center">{{ t('nav.agenda') }}</CtaLink>
      <CtaLink :href="whatsappHref" variant="outline" size="lg" :icon="WhatsAppIcon" class="justify-center">
        {{ t('contacto.whatsapp') }}
      </CtaLink>
    </div>
  </div>
</template>
