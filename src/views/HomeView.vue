<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { CalendarDays, ArrowRight, Clock } from '@lucide/vue'
import { WLogo, CtaLink } from '@/components/ui'
import { SectionHeader } from '@/components/layout'
import { RevealOnScroll, ServiceCard, StatsBar, TechMarquee, CtaBanner, SocialLinks } from '@/components/shared'
import { services, pillars, useCases, processSteps } from '@/data'

const { t } = useI18n()

const featuredServices = services.slice(0, 3)
</script>

<template>
  <main class="overflow-x-clip bg-abyss text-silver">
    <!-- ============ HERO ============ -->
    <section class="relative flex min-h-svh flex-col justify-between pt-24 md:pt-28">
      <!-- Fondo: brillos con deriva lenta -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          class="animate-drift absolute -top-40 right-0 size-[24rem] rounded-full bg-carbon/60 blur-[120px] md:size-[36rem]"
        />
        <div
          class="animate-drift absolute bottom-0 left-0 size-[18rem] rounded-full bg-jade-soft/10 blur-[120px] md:size-[28rem]"
          style="animation-delay: -9s; animation-direction: alternate-reverse"
        />
      </div>

      <div
        class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-8 px-6 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-12 lg:gap-y-0"
      >
        <!-- Texto -->
        <div class="pt-6 lg:col-start-1 lg:row-start-1 lg:self-end lg:pt-0">
          <p
            class="animate-fade-up mb-5 text-xs font-medium uppercase tracking-[0.35em] text-steel md:mb-6"
            style="animation-delay: 100ms"
          >
            {{ t('hero.kicker') }}
          </p>

          <h1 class="font-display leading-[0.9]">
            <span class="block overflow-hidden">
              <span
                class="animate-rise text-metal block text-[clamp(3.5rem,14vw,11rem)]"
                style="animation-delay: 200ms"
              >
                {{ t('hero.titulo_l1') }}
              </span>
            </span>
            <span class="block overflow-hidden">
              <span
                class="animate-rise text-metal block text-[clamp(3.5rem,14vw,11rem)]"
                style="animation-delay: 340ms"
              >
                {{ t('hero.titulo_l2') }}
              </span>
            </span>
          </h1>

          <p
            class="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-silver/70 md:mt-8 md:text-lg"
            style="animation-delay: 500ms"
          >
            {{ t('hero.subtitulo') }}
          </p>
        </div>

        <!-- Botones y redes (en móvil van después del logo) -->
        <div class="order-3 flex flex-col gap-8 lg:col-start-1 lg:row-start-2 lg:mt-10 lg:self-start">
          <div
            class="animate-fade-up flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center lg:justify-start"
            style="animation-delay: 650ms"
          >
            <CtaLink to="/agenda" size="lg" :icon="CalendarDays" class="justify-center">
              {{ t('hero.cta_agenda') }}
            </CtaLink>
            <CtaLink to="/servicios" variant="outline" size="lg" class="justify-center">
              {{ t('hero.cta_servicios') }}
            </CtaLink>
          </div>
          <SocialLinks label class="animate-fade-up justify-center lg:justify-start" style="animation-delay: 800ms" />
        </div>

        <!-- Logo protagonista con órbita (en móvil entre texto y botones) -->
        <div
          class="animate-fade-in relative order-2 mx-auto my-6 flex min-h-[17rem] w-full max-w-[16rem] items-center justify-center sm:my-8 sm:min-h-[21rem] sm:max-w-[20rem] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-0 lg:min-h-0 lg:max-w-none lg:self-center"
          style="animation-delay: 450ms"
        >
          <div
            class="animate-spin-slow pointer-events-none absolute size-[15rem] rounded-full border border-ink/10 sm:size-[19rem] lg:size-[26rem]"
          >
            <span
              class="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-jade-soft shadow-[0_0_14px_var(--jade-glow)]"
            />
          </div>
          <div
            class="pointer-events-none absolute size-[11rem] rounded-full border border-dashed border-ink/5 sm:size-[14rem] lg:size-[19rem]"
          />
          <div class="animate-float-y relative">
            <WLogo
              class="animate-float-x h-24 w-[6.6rem] text-silver drop-shadow-[0_20px_50px_var(--logo-glow)] sm:h-32 sm:w-[8.75rem] lg:h-44 lg:w-48"
            />
          </div>
        </div>
      </div>

      <TechMarquee class="mt-10 md:mt-16" />
    </section>

    <!-- ============ STATS ============ -->
    <section class="mx-auto max-w-7xl px-6 pt-14 md:pt-20">
      <RevealOnScroll>
        <StatsBar />
      </RevealOnScroll>
    </section>

    <!-- ============ MANIFIESTO (por qué WindKode) ============ -->
    <section class="mx-auto max-w-7xl px-6 pt-16 md:pt-32">
      <div class="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <RevealOnScroll>
          <div>
            <p class="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-steel">
              {{ t('home.manifiesto.kicker') }}
            </p>
            <h2 class="font-display text-metal text-5xl uppercase leading-[0.95] sm:text-6xl md:text-8xl">
              <span class="block">{{ t('home.manifiesto.titulo_l1') }}</span>
              <span class="block">{{ t('home.manifiesto.titulo_l2') }}</span>
              <span class="block">{{ t('home.manifiesto.titulo_l3') }}</span>
            </h2>
            <p class="mt-6 max-w-lg leading-relaxed text-silver/70 md:mt-8 md:text-lg">
              {{ t('home.manifiesto.texto') }}
            </p>
            <div class="mt-8">
              <CtaLink to="/nosotros" variant="outline" :icon="ArrowRight">{{ t('home.manifiesto.cta') }}</CtaLink>
            </div>
          </div>
        </RevealOnScroll>

        <div class="flex flex-col gap-4">
          <RevealOnScroll v-for="(pillar, i) in pillars" :key="pillar.key" :delay="120 + i * 120">
            <div
              class="group flex items-start gap-5 rounded-2xl border border-ink/10 bg-graphite/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-jade-soft/30"
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
    </section>

    <!-- ============ SERVICIOS (adelanto) ============ -->
    <section class="mx-auto max-w-7xl px-6 py-16 md:py-32">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          :kicker="t('servicios.kicker')"
          :title="t('servicios.titulo')"
          :subtitle="t('servicios.subtitulo')"
        />
      </RevealOnScroll>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll v-for="(service, i) in featuredServices" :key="service.key" :delay="i * 90">
          <ServiceCard :service="service" :index="i" />
        </RevealOnScroll>
      </div>

      <RevealOnScroll :delay="200">
        <div class="mt-10 flex justify-center">
          <CtaLink to="/servicios" variant="outline">{{ t('home.ver_servicios') }}</CtaLink>
        </div>
      </RevealOnScroll>
    </section>

    <!-- ============ QUÉ RESOLVEMOS ============ -->
    <section class="mx-auto max-w-7xl px-6 pb-16 md:pb-32">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          :kicker="t('home.resolvemos.kicker')"
          :title="t('home.resolvemos.titulo')"
          :subtitle="t('home.resolvemos.subtitulo')"
        />
      </RevealOnScroll>

      <div class="grid gap-5 md:grid-cols-2">
        <RevealOnScroll v-for="(useCase, i) in useCases" :key="useCase.key" :delay="i * 90">
          <article
            class="group flex h-full gap-5 rounded-2xl border border-ink/10 bg-ink/[0.03] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-jade-soft/30 hover:bg-carbon/60 sm:p-8"
          >
            <span
              class="flex size-12 shrink-0 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10 group-hover:text-jade"
            >
              <component :is="useCase.icon" class="size-6" :stroke-width="1.5" />
            </span>
            <div>
              <h3 class="text-lg font-semibold text-ink">
                {{ t(`home.resolvemos.items.${useCase.key}.titulo`) }}
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-silver/60">
                {{ t(`home.resolvemos.items.${useCase.key}.descripcion`) }}
              </p>
            </div>
          </article>
        </RevealOnScroll>
      </div>
    </section>

    <!-- ============ PROCESO (adelanto) ============ -->
    <section class="mx-auto max-w-7xl px-6 pb-16 md:pb-32">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          :kicker="t('home.proceso.kicker')"
          :title="t('home.proceso.titulo')"
          :subtitle="t('home.proceso.subtitulo')"
        />
      </RevealOnScroll>

      <ol class="grid gap-px overflow-hidden rounded-3xl border border-ink/10 bg-ink/5 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="(step, i) in processSteps" :key="step.key" class="h-full bg-abyss">
          <RevealOnScroll :delay="i * 80" class="h-full">
            <div class="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-carbon/60 sm:p-7">
              <div class="flex items-center justify-between">
                <span
                  class="flex size-10 items-center justify-center rounded-xl border border-ink/10 bg-ink/5 text-silver transition-colors group-hover:border-jade-soft/40 group-hover:bg-jade/10 group-hover:text-jade"
                >
                  <component :is="step.icon" class="size-5" :stroke-width="1.5" />
                </span>
                <span class="font-display text-3xl text-ink/10 transition-colors group-hover:text-jade/40">
                  {{ String(i + 1).padStart(2, '0') }}
                </span>
              </div>
              <div>
                <h3 class="font-semibold text-ink">
                  {{ t(`proceso.pasos.${step.key}.titulo`) }}
                </h3>
                <p class="mt-1.5 text-sm leading-relaxed text-silver/60">
                  {{ t(`proceso.pasos.${step.key}.descripcion`) }}
                </p>
              </div>
              <span class="mt-auto flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-silver/50">
                <Clock class="size-3" />
                {{ t(`proceso.pasos.${step.key}.duracion`) }}
              </span>
            </div>
          </RevealOnScroll>
        </li>
      </ol>

      <RevealOnScroll :delay="200">
        <div class="mt-10 flex justify-center">
          <CtaLink to="/servicios#proceso" variant="outline" :icon="ArrowRight">{{ t('home.proceso.cta') }}</CtaLink>
        </div>
      </RevealOnScroll>
    </section>

    <!-- ============ AGENDA (banner) ============ -->
    <section class="mx-auto max-w-7xl px-6 pb-16 md:pb-32">
      <RevealOnScroll>
        <CtaBanner />
      </RevealOnScroll>
    </section>
  </main>
</template>
