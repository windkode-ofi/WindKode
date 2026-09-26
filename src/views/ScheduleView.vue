<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Mail, Clock } from '@lucide/vue'
import { SectionHeader } from '@/components/layout'
import { ContactForm, RevealOnScroll, SocialLinks } from '@/components/shared'
import { WhatsAppIcon } from '@/components/ui'
import { useContact } from '@/composables/useContact'

const { t } = useI18n()
const { email, mailtoHref, whatsappHref, whatsappDisplay } = useContact()
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-abyss pt-28 md:pt-36 text-silver">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute left-1/2 top-0 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-carbon/60 blur-[120px]" />
    </div>

    <div class="relative mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      <div class="grid items-center gap-14 lg:grid-cols-2">
        <RevealOnScroll>
          <div>
            <SectionHeader align="left" class="mb-0" :kicker="t('agenda.kicker')">
              <template #title>
                <span class="block">{{ t('agenda.titulo_l1') }}</span>
                <span class="block">{{ t('agenda.titulo_l2') }}</span>
              </template>
            </SectionHeader>
            <p class="mt-6 max-w-md leading-relaxed text-silver/70">{{ t('agenda.subtitulo') }}</p>

            <div class="mt-10 flex flex-col gap-3 text-sm text-silver/70">
              <a
                :href="whatsappHref"
                target="_blank"
                rel="noopener noreferrer"
                class="group inline-flex items-center gap-3 transition-colors hover:text-jade"
              >
                <span
                  class="flex size-10 items-center justify-center rounded-full border border-ink/10 transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10"
                >
                  <WhatsAppIcon class="size-4" />
                </span>
                <span class="flex flex-col">
                  <span class="text-ink">{{ t('contacto.whatsapp') }}</span>
                  <span class="text-xs text-silver/50">{{ whatsappDisplay }}</span>
                </span>
              </a>
              <a
                :href="mailtoHref"
                class="group inline-flex items-center gap-3 transition-colors hover:text-jade"
              >
                <span
                  class="flex size-10 items-center justify-center rounded-full border border-ink/10 transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10"
                >
                  <Mail class="size-4" :stroke-width="1.5" />
                </span>
                <span class="flex flex-col">
                  <span class="text-ink">{{ t('agenda.email_label') }}</span>
                  <span class="text-xs text-silver/50">{{ email }}</span>
                </span>
              </a>
              <p class="inline-flex items-center gap-3">
                <span class="flex size-10 items-center justify-center rounded-full border border-ink/10">
                  <Clock class="size-4" :stroke-width="1.5" />
                </span>
                {{ t('agenda.respuesta') }}
              </p>
            </div>

            <SocialLinks label class="mt-10" />
          </div>
        </RevealOnScroll>

        <RevealOnScroll :delay="150">
          <div class="relative rounded-3xl border border-ink/10 bg-ink/[0.03] p-6 backdrop-blur-sm sm:p-8 md:p-10">
            <ContactForm />
          </div>
        </RevealOnScroll>
      </div>
    </div>
  </main>
</template>
