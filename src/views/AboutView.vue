<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ArrowRight, Compass, Telescope } from '@lucide/vue'
import { CtaLink, WLogo } from '@/components/ui'
import { SectionHeader } from '@/components/layout'
import { RevealOnScroll, StatsBar, CtaBanner } from '@/components/shared'
import { pillars, values, commitments } from '@/data'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen bg-abyss pt-28 md:pt-36 text-silver">
    <div class="mx-auto max-w-7xl px-6 pb-24 md:pb-32">
      <!-- ============ INTRO + PILARES ============ -->
      <div class="grid gap-14 lg:grid-cols-2">
        <RevealOnScroll>
          <div>
            <SectionHeader align="left" class="mb-0" :kicker="t('nosotros.kicker')" :title="t('nosotros.titulo')" />
            <p class="mt-8 max-w-xl leading-relaxed text-silver/70">
              {{ t('nosotros.p1') }}
            </p>
            <p class="mt-4 max-w-xl leading-relaxed text-silver/70">
              {{ t('nosotros.p2') }}
            </p>
            <p class="mt-4 max-w-xl leading-relaxed text-silver/70">
              {{ t('nosotros.p3') }}
            </p>
            <div class="mt-8">
              <CtaLink to="/equipo" variant="outline" :icon="ArrowRight">{{ t('nosotros.cta_equipo') }}</CtaLink>
            </div>
          </div>
        </RevealOnScroll>

        <div class="flex flex-col justify-center gap-4">
          <RevealOnScroll v-for="(pillar, i) in pillars" :key="pillar.key" :delay="i * 120">
            <div
              class="group flex items-start gap-5 rounded-2xl border border-ink/10 bg-graphite/60 p-6 transition-all duration-300 hover:border-jade-soft/30"
            >
              <span
                class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10 group-hover:text-jade"
              >
                <component :is="pillar.icon" class="size-6" :stroke-width="1.5" />
              </span>
              <div>
                <h3 class="font-semibold text-ink">
                  {{ t(`filosofia.${pillar.key}.titulo`) }}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-silver/60">
                  {{ t(`filosofia.${pillar.key}.descripcion`) }}
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      <!-- ============ HISTORIA: ¿POR QUÉ EL VIENTO? ============ -->
      <section class="mt-24 md:mt-32">
        <div
          class="relative overflow-hidden rounded-3xl border border-ink/10 bg-gradient-to-br from-carbon via-graphite to-abyss px-6 py-12 sm:px-10 sm:py-16 md:px-16"
        >
          <WLogo class="pointer-events-none absolute -bottom-12 -left-10 h-48 w-52 -rotate-12 text-ink/[0.04]" />

          <div class="relative grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
            <RevealOnScroll>
              <div>
                <p class="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-steel">
                  {{ t('nosotros.viento.kicker') }}
                </p>
                <h2 class="font-display text-metal text-4xl uppercase leading-[0.95] sm:text-5xl md:text-7xl">
                  {{ t('nosotros.viento.titulo') }}
                </h2>
                <p class="mt-6 max-w-xl leading-relaxed text-silver/70">
                  {{ t('nosotros.viento.p1') }}
                </p>
                <p class="mt-4 max-w-xl leading-relaxed text-silver/70">
                  {{ t('nosotros.viento.p2') }}
                </p>
              </div>
            </RevealOnScroll>

            <div class="flex flex-col justify-center gap-4">
              <RevealOnScroll :delay="120">
                <article class="rounded-2xl border border-ink/10 bg-abyss/60 p-6 backdrop-blur-sm sm:p-7">
                  <div class="flex items-center gap-3">
                    <span
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver"
                    >
                      <Compass class="size-5" :stroke-width="1.5" />
                    </span>
                    <h3 class="font-display text-2xl uppercase tracking-wide text-ink">
                      {{ t('nosotros.mision.titulo') }}
                    </h3>
                  </div>
                  <p class="mt-4 text-sm leading-relaxed text-silver/70">
                    {{ t('nosotros.mision.texto') }}
                  </p>
                </article>
              </RevealOnScroll>
              <RevealOnScroll :delay="240">
                <article class="rounded-2xl border border-ink/10 bg-abyss/60 p-6 backdrop-blur-sm sm:p-7">
                  <div class="flex items-center gap-3">
                    <span
                      class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver"
                    >
                      <Telescope class="size-5" :stroke-width="1.5" />
                    </span>
                    <h3 class="font-display text-2xl uppercase tracking-wide text-ink">
                      {{ t('nosotros.vision.titulo') }}
                    </h3>
                  </div>
                  <p class="mt-4 text-sm leading-relaxed text-silver/70">
                    {{ t('nosotros.vision.texto') }}
                  </p>
                </article>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      <!-- ============ VALORES ============ -->
      <section class="mt-24 md:mt-32">
        <RevealOnScroll>
          <SectionHeader
            :kicker="t('nosotros.valores.kicker')"
            :title="t('nosotros.valores.titulo')"
            :subtitle="t('nosotros.valores.subtitulo')"
          />
        </RevealOnScroll>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <RevealOnScroll v-for="(value, i) in values" :key="value.key" :delay="i * 100">
            <article
              class="group flex h-full flex-col gap-4 rounded-2xl border border-ink/10 bg-ink/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-jade-soft/30 hover:bg-carbon/60"
            >
              <div
                class="flex size-11 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10 group-hover:text-jade"
              >
                <component :is="value.icon" class="size-5" :stroke-width="1.5" />
              </div>
              <div>
                <h3 class="text-base font-semibold text-ink">
                  {{ t(`nosotros.valores.items.${value.key}.titulo`) }}
                </h3>
                <p class="mt-2 text-sm leading-relaxed text-silver/60">
                  {{ t(`nosotros.valores.items.${value.key}.descripcion`) }}
                </p>
              </div>
            </article>
          </RevealOnScroll>
        </div>
      </section>

      <!-- ============ COMPROMISOS ============ -->
      <section class="mt-24 md:mt-32">
        <RevealOnScroll>
          <SectionHeader
            align="split"
            :kicker="t('nosotros.compromisos.kicker')"
            :title="t('nosotros.compromisos.titulo')"
            :subtitle="t('nosotros.compromisos.subtitulo')"
          />
        </RevealOnScroll>

        <ol class="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/5 md:grid-cols-2">
          <li v-for="(key, i) in commitments" :key="key" class="h-full bg-abyss">
            <RevealOnScroll :delay="i * 100" class="h-full">
              <div class="group flex h-full gap-6 p-7 transition-colors hover:bg-carbon/60 sm:p-9">
                <span class="font-display text-metal shrink-0 text-5xl leading-none sm:text-6xl">
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
                <div>
                  <h3 class="text-lg font-semibold text-ink">
                    {{ t(`nosotros.compromisos.items.${key}.titulo`) }}
                  </h3>
                  <p class="mt-2 text-sm leading-relaxed text-silver/60">
                    {{ t(`nosotros.compromisos.items.${key}.descripcion`) }}
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </li>
        </ol>
      </section>

      <RevealOnScroll :delay="150">
        <StatsBar class="mt-24 md:mt-32" />
      </RevealOnScroll>

      <RevealOnScroll :delay="150">
        <CtaBanner class="mt-20" />
      </RevealOnScroll>
    </div>
  </main>
</template>
