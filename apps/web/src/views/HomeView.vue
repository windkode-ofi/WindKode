<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { CalendarDays, ArrowRight, Clock } from '@lucide/vue'
import { WLogo, CtaLink } from '@/components/ui'
import { SectionHeader } from '@/components/layout'
import {
  RevealOnScroll,
  ServiceCard,
  StatsBar,
  TechMarquee,
  CtaBanner,
  SocialLinks,
  StackScene,
} from '@/components/shared'
import { MaskLines, ScrollText, TiltCard, WindCanvas } from '@/components/motion'
import { useScrollProgress } from '@/composables/useScrollProgress'
import { services, pillars, useCases, processSteps, stackLayers } from '@/data'

const { t } = useI18n()

const featuredServices = services.slice(0, 3)

/*
 * Hero interactivo. Todo va por variables CSS escritas directamente en el
 * elemento (sin re-render por frame):
 *   --hp        progreso del scroll al salir del hero (parallax y fundido)
 *   --hx / --hy posición del cursor (foco de luz)
 *   --lx / --ly desviación del cursor respecto al centro (inclinación del logo)
 */
const hero = ref<HTMLElement | null>(null)
const heroProgress = useScrollProgress(hero, [0, 0], 0)
watch(heroProgress, (p) => hero.value?.style.setProperty('--hp', p.toFixed(4)))

function onHeroMove(e: PointerEvent) {
  const el = hero.value
  if (!el || e.pointerType !== 'mouse') return
  const r = el.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  el.style.setProperty('--hx', `${(x * 100).toFixed(1)}%`)
  el.style.setProperty('--hy', `${(y * 100).toFixed(1)}%`)
  el.style.setProperty('--lx', (x - 0.5).toFixed(3))
  el.style.setProperty('--ly', (y - 0.5).toFixed(3))
}

function onHeroLeave() {
  hero.value?.style.setProperty('--lx', '0')
  hero.value?.style.setProperty('--ly', '0')
}

</script>

<template>
  <main class="overflow-x-clip bg-abyss text-silver">
    <!-- ============ HERO ============ -->
    <section
      ref="hero"
      class="intro-gate relative flex min-h-svh flex-col justify-between overflow-hidden pt-24 md:pt-28"
      @pointermove="onHeroMove"
      @pointerleave="onHeroLeave"
    >
      <!-- Fondo: estrellas con viento, brillos con deriva y foco de luz del cursor -->
      <div class="pointer-events-none absolute inset-0">
        <div
          class="animate-drift absolute -top-40 right-0 size-[24rem] rounded-full bg-carbon/60 blur-[120px] md:size-[36rem]"
        />
        <div
          class="animate-drift absolute bottom-0 left-0 size-[18rem] rounded-full bg-jade-soft/10 blur-[120px] md:size-[28rem]"
          style="animation-delay: -9s; animation-direction: alternate-reverse"
        />
        <WindCanvas class="animate-fade-in absolute inset-0 size-full" style="animation-delay: 600ms" />
        <div
          class="absolute inset-0"
          style="background: radial-gradient(640px circle at var(--hx, 70%) var(--hy, 40%), var(--hero-spot), transparent 60%)"
        />
      </div>

      <div
        class="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center gap-8 px-6 will-change-transform lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-12 lg:gap-y-0"
        style="transform: translate3d(0, calc(var(--hp, 0) * 30%), 0); opacity: calc(1 - var(--hp, 0) * 1.3)"
      >
        <!-- Texto -->
        <div class="pt-6 lg:col-start-1 lg:row-start-1 lg:self-end lg:pt-0">
          <p
            class="animate-fade-up mb-5 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-steel md:mb-6"
            style="animation-delay: 100ms"
          >
            <span class="h-px w-8 bg-jade-soft" />
            {{ t('hero.kicker') }}
          </p>

          <h1 class="font-display leading-[0.9]">
            <span class="block" style="transform: translate3d(calc(var(--hp, 0) * -12%), 0, 0)">
              <span class="mask-line">
                <span
                  class="animate-rise-tilt text-metal block text-[clamp(3.5rem,14vw,11rem)]"
                  style="animation-delay: 200ms"
                >
                  {{ t('hero.titulo_l1') }}
                </span>
              </span>
            </span>
            <span class="block" style="transform: translate3d(calc(var(--hp, 0) * 12%), 0, 0)">
              <span class="mask-line">
                <span
                  class="animate-rise-tilt text-outline block text-[clamp(3.5rem,14vw,11rem)] lg:pl-[6vw]"
                  style="animation-delay: 340ms"
                >
                  {{ t('hero.titulo_l2') }}
                </span>
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

        <!-- Logo protagonista con órbita; se inclina hacia el cursor (en móvil entre texto y botones) -->
        <div
          class="animate-fade-in relative order-2 mx-auto my-6 flex min-h-[17rem] w-full max-w-[16rem] items-center justify-center sm:my-8 sm:min-h-[21rem] sm:max-w-[20rem] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:my-0 lg:min-h-0 lg:max-w-none lg:self-center"
          style="animation-delay: 450ms"
        >
          <div
            class="relative flex items-center justify-center transition-transform duration-700 ease-out"
            style="
              transform: perspective(900px) rotateY(calc(var(--lx, 0) * 22deg)) rotateX(calc(var(--ly, 0) * -22deg))
                scale(calc(1 - var(--hp, 0) * 0.25));
            "
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
      </div>

      <TechMarquee class="mt-10 md:mt-16" />
    </section>

    <!-- ============ CIFRAS ============ -->
    <section id="cifras" class="mx-auto max-w-7xl px-6 pt-14 md:pt-20">
      <RevealOnScroll>
        <StatsBar />
      </RevealOnScroll>
    </section>

    <!-- ============ MANIFIESTO (por qué WindKode) ============ -->
    <section class="mx-auto max-w-7xl px-6 pt-20 md:pt-40">
      <div class="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-5">
          <p class="mb-4 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.35em] text-steel">
            <span class="tracking-normal text-jade-soft">(01)</span>
            <span class="h-px w-8 bg-steel/40" />
            {{ t('home.manifiesto.kicker') }}
          </p>
          <MaskLines
            :lines="[t('home.manifiesto.titulo_l1'), t('home.manifiesto.titulo_l2'), t('home.manifiesto.titulo_l3')]"
            :stagger="110"
            line-class="text-metal"
            :line-classes="[undefined, 'text-outline']"
            class="font-display text-6xl uppercase leading-[0.92] sm:text-7xl md:text-8xl lg:text-9xl"
          />
          <RevealOnScroll :delay="200">
            <div class="mt-10">
              <CtaLink to="/nosotros" variant="outline" :icon="ArrowRight">{{ t('home.manifiesto.cta') }}</CtaLink>
            </div>
          </RevealOnScroll>
        </div>

        <div class="lg:col-span-7">
          <ScrollText
            :text="t('home.manifiesto.texto')"
            class="text-2xl font-medium leading-snug tracking-tight text-ink sm:text-3xl md:text-4xl"
          />

          <div class="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-3 md:mt-20">
            <RevealOnScroll v-for="(pillar, i) in pillars" :key="pillar.key" :delay="i * 110" class="h-full">
              <div class="group flex h-full flex-col bg-abyss p-6 transition-colors duration-500 hover:bg-carbon/60">
                <div class="flex items-center justify-between">
                  <span
                    class="flex size-11 items-center justify-center rounded-full border border-ink/10 text-silver transition-[color,border-color,rotate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[360deg] group-hover:border-jade-soft/40 group-hover:text-jade"
                  >
                    <component :is="pillar.icon" class="size-5" :stroke-width="1.5" />
                  </span>
                  <span class="text-xs text-jade-soft">0{{ i + 1 }}</span>
                </div>
                <h3 class="mt-8 font-semibold text-ink">{{ t(`filosofia.${pillar.key}.titulo`) }}</h3>
                <p class="mt-2 flex-1 text-sm leading-relaxed text-silver/60">
                  {{ t(`filosofia.${pillar.key}.descripcion`) }}
                </p>
                <span
                  class="mt-6 block h-px w-0 bg-jade-soft transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>

    <!-- ============ SERVICIOS (adelanto) ============ -->
    <section class="mx-auto max-w-7xl px-6 py-20 md:py-40">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          index="02"
          :kicker="t('servicios.kicker')"
          :title="t('servicios.titulo')"
          :subtitle="t('servicios.subtitulo')"
        />
      </RevealOnScroll>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <RevealOnScroll v-for="(service, i) in featuredServices" :key="service.key" :delay="i * 110" class="h-full">
          <ServiceCard :service="service" :index="i" />
        </RevealOnScroll>
      </div>

      <RevealOnScroll :delay="200">
        <div class="mt-10 flex justify-center">
          <CtaLink to="/servicios" variant="outline">{{ t('home.ver_servicios') }}</CtaLink>
        </div>
      </RevealOnScroll>
    </section>

    <!-- ============ ARQUITECTURA: pila de software en 3D ============ -->
    <section class="mx-auto max-w-7xl px-6 pb-20 md:pb-40">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          index="03"
          :kicker="t('home.arquitectura.kicker')"
          :title="t('home.arquitectura.titulo')"
          :subtitle="t('home.arquitectura.texto')"
        />
      </RevealOnScroll>
      <StackScene :layers="stackLayers" />
    </section>

    <!-- ============ QUÉ RESOLVEMOS ============ -->
    <section class="mx-auto max-w-7xl px-6 pb-20 md:pb-32">
      <RevealOnScroll>
        <SectionHeader
          align="split"
          index="04"
          :kicker="t('home.resolvemos.kicker')"
          :title="t('home.resolvemos.titulo')"
          :subtitle="t('home.resolvemos.subtitulo')"
        />
      </RevealOnScroll>

      <div class="grid gap-5 md:grid-cols-2">
        <RevealOnScroll v-for="(useCase, i) in useCases" :key="useCase.key" :delay="(i % 2) * 120" class="h-full">
          <TiltCard :max="4">
            <article
              class="group flex h-full gap-5 rounded-2xl border border-ink/10 bg-ink/[0.03] p-7 transition-colors duration-500 hover:border-jade-soft/30 hover:bg-carbon/60 sm:p-8"
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
          </TiltCard>
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
    <section class="mx-auto max-w-7xl px-6 py-20 md:py-32">
      <RevealOnScroll>
        <CtaBanner />
      </RevealOnScroll>
    </section>
  </main>
</template>
