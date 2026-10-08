<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CalendarDays } from '@lucide/vue'
import { CtaLink, WLogo, WhatsAppIcon } from '@/components/ui'
import { MaskLines, TiltCard } from '@/components/motion'
import { useContact } from '@/composables/useContact'

const { t } = useI18n()
const { whatsappHref } = useContact()
</script>

<template>
  <TiltCard :max="2" rounded="rounded-3xl">
    <div
      class="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-carbon via-graphite to-abyss px-6 py-12 text-center sm:px-8 sm:py-16 md:px-16"
    >
      <WLogo
        class="pointer-events-none absolute -right-10 -top-10 h-40 w-44 rotate-12 text-ink/[0.04] transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-x-6 group-hover:translate-y-6 group-hover:rotate-0"
      />
      <p class="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-steel">{{ t('agenda.kicker') }}</p>
      <MaskLines
        :lines="[t('agenda.titulo_l1'), t('agenda.titulo_l2')]"
        line-class="text-metal"
        class="font-display text-4xl uppercase leading-[0.95] sm:text-5xl md:text-7xl"
      />
      <p class="mx-auto mt-6 max-w-md leading-relaxed text-silver/70">{{ t('agenda.subtitulo') }}</p>
      <div class="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <CtaLink to="/agenda" size="lg" :icon="CalendarDays" class="justify-center">{{ t('nav.agenda') }}</CtaLink>
        <CtaLink :href="whatsappHref" variant="outline" size="lg" :icon="WhatsAppIcon" class="justify-center">
          {{ t('contacto.whatsapp') }}
        </CtaLink>
      </div>
    </div>
  </TiltCard>
</template>
