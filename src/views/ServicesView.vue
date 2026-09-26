<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SectionHeader } from '@/components/layout'
import { RevealOnScroll, ServiceCard, ProcessOrbit, ProcessTimeline, TechMarquee, CtaBanner } from '@/components/shared'
import { services, processSteps } from '@/data'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen bg-abyss pt-28 md:pt-36 text-silver">
    <div class="mx-auto max-w-7xl px-6">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          :kicker="t('servicios.kicker')"
          :title="t('servicios.titulo')"
          :subtitle="t('servicios.subtitulo')"
        />
      </RevealOnScroll>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll v-for="(service, i) in services" :key="service.key" :delay="i * 90">
          <ServiceCard :service="service" :index="i" />
        </RevealOnScroll>
      </div>
    </div>

    <!-- Proceso: órbita interactiva -->
    <section id="proceso" class="mt-24 md:mt-32">
      <div class="mx-auto max-w-7xl px-6">
        <RevealOnScroll>
          <SectionHeader
            :kicker="t('proceso.kicker')"
            :title="t('proceso.titulo')"
            :subtitle="t('proceso.subtitulo')"
          />
        </RevealOnScroll>

        <RevealOnScroll :delay="120">
          <ProcessOrbit :steps="processSteps" />
          <p class="-mt-2 text-center text-xs uppercase tracking-[0.3em] text-silver/45">
            {{ t('proceso.hint') }}
          </p>
        </RevealOnScroll>
      </div>
    </section>

    <!-- Ciclo de desarrollo: línea de tiempo detallada -->
    <section id="ciclo" class="mx-auto mt-24 max-w-7xl px-6 md:mt-32">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          :kicker="t('proceso.ciclo.kicker')"
          :title="t('proceso.ciclo.titulo')"
          :subtitle="t('proceso.ciclo.subtitulo')"
        />
      </RevealOnScroll>
      <ProcessTimeline :steps="processSteps" />
    </section>

    <TechMarquee class="mt-8 md:mt-12" />

    <div class="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      <RevealOnScroll :delay="150">
        <CtaBanner class="mt-20" />
      </RevealOnScroll>
    </div>
  </main>
</template>
