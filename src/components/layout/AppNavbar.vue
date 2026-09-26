<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Menu, X, Sun, Moon, CalendarDays } from '@lucide/vue'
import { useLocale } from '@/composables/useLocale'
import { useTheme } from '@/composables/useTheme'
import { WLogo, CtaLink } from '@/components/ui'

const route = useRoute()
const { t } = useI18n()
const { locale, toggle } = useLocale()
const { isDark, toggle: toggleTheme } = useTheme()
const isOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 32
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.documentElement.style.overflow = ''
})

// Cierra el menú al navegar y bloquea el scroll de fondo mientras está abierto
watch(() => route.path, () => (isOpen.value = false))
watch(isOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
})

const links = [
  { to: '/servicios', label: 'nav.servicios' },
  { to: '/nosotros', label: 'nav.nosotros' },
  { to: '/equipo', label: 'nav.equipo' },
]

</script>

<template>
  <nav
    class="fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
    :class="scrolled && 'md:px-6 md:pt-3'"
  >
    <!-- Menú móvil a pantalla completa (detrás de la barra) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 -z-10 flex flex-col bg-abyss/95 backdrop-blur-2xl lg:hidden">
        <div class="flex flex-1 flex-col justify-center gap-2 px-8">
          <RouterLink
            v-for="(link, i) in links"
            :key="link.to"
            :to="link.to"
            class="animate-fade-up font-display text-5xl uppercase tracking-wide transition-colors sm:text-6xl"
            :style="{ animationDelay: `${120 + i * 70}ms` }"
            :class="route.path === link.to ? 'text-metal' : 'text-silver/70 hover:text-jade'"
            @click="isOpen = false"
          >
            {{ t(link.label) }}
          </RouterLink>

          <div
            class="animate-fade-up mt-8 self-start"
            :style="{ animationDelay: `${120 + links.length * 70}ms` }"
          >
            <CtaLink to="/agenda" size="lg" :icon="CalendarDays" @click="isOpen = false">
              {{ t('nav.agenda') }}
            </CtaLink>
          </div>
        </div>

        <div
          class="animate-fade-up flex items-center justify-between border-t border-ink/10 px-8 py-6"
          :style="{ animationDelay: `${190 + links.length * 70}ms` }"
        >
          <p class="text-[0.65rem] uppercase tracking-[0.3em] text-silver/40">WindKode</p>
          <div class="flex items-center gap-3">
            <button
              class="flex size-9 items-center justify-center rounded-full border border-ink/10 text-silver/70 transition-colors hover:border-jade-soft/40 hover:text-jade"
              :title="isDark ? 'Light mode' : 'Dark mode'"
              @click="toggleTheme"
            >
              <span class="sr-only">{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
              <Sun v-if="isDark" class="size-4" :stroke-width="1.5" />
              <Moon v-else class="size-4" :stroke-width="1.5" />
            </button>
            <button
              class="rounded-full border border-ink/10 px-4 py-2 text-xs font-medium uppercase tracking-widest text-silver/70 transition-colors hover:border-jade-soft/40 hover:text-jade"
              @click="toggle"
            >
              {{ locale === 'es' ? 'EN' : 'ES' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Fondo de barra completa: se desvanece al pasar a isla (solo md+) -->
    <div
      class="absolute inset-0 border-b border-ink/5 bg-abyss/80 backdrop-blur-xl transition-opacity duration-500"
      :class="[isOpen && 'opacity-0', scrolled && !isOpen && 'md:opacity-0']"
    />

    <!-- Cáscara: barra completa en móvil, isla flotante desde md al hacer scroll -->
    <div
      class="relative mx-auto max-w-7xl rounded-none border border-transparent bg-transparent px-6 shadow-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      :class="
        scrolled &&
        !isOpen &&
        'md:max-w-4xl md:rounded-full md:border-ink/10 md:bg-graphite/80 md:px-5 md:shadow-2xl md:shadow-veil/40 md:backdrop-blur-xl'
      "
    >
      <div
        class="flex items-center justify-between py-3.5 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        :class="scrolled && !isOpen && 'md:py-2.5'"
      >
        <!-- El logo es el inicio -->
        <RouterLink
          to="/"
          class="flex items-center gap-3 text-ink transition-opacity hover:opacity-80"
          @click="isOpen = false"
        >
          <WLogo class="h-8 w-9" />
          <span class="font-display text-2xl tracking-[0.18em]">WIND<span class="text-jade-soft">KODE</span></span>
        </RouterLink>

        <ul class="hidden items-center gap-8 lg:flex">
          <li v-for="link in links" :key="link.to">
            <RouterLink
              :to="link.to"
              class="text-xs font-medium uppercase tracking-[0.2em] transition-colors"
              :class="route.path === link.to ? 'text-jade' : 'text-silver/60 hover:text-jade'"
            >
              {{ t(link.label) }}
            </RouterLink>
          </li>
        </ul>

        <div class="flex items-center gap-3">
          <button
            class="hidden size-8 items-center justify-center rounded-full border border-ink/10 text-silver/70 transition-colors hover:border-jade-soft/40 hover:text-jade lg:flex"
            :title="isDark ? 'Light mode' : 'Dark mode'"
            @click="toggleTheme"
          >
            <span class="sr-only">{{ isDark ? 'Light mode' : 'Dark mode' }}</span>
            <Sun v-if="isDark" class="size-4" :stroke-width="1.5" />
            <Moon v-else class="size-4" :stroke-width="1.5" />
          </button>

          <button
            class="hidden rounded-full border border-ink/10 px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-silver/70 transition-colors hover:border-jade-soft/40 hover:text-jade lg:block"
            @click="toggle"
          >
            {{ locale === 'es' ? 'EN' : 'ES' }}
          </button>

          <div class="hidden lg:block">
            <CtaLink to="/agenda" :icon="CalendarDays">{{ t('nav.agenda') }}</CtaLink>
          </div>

          <!-- Hamburguesa (móvil y tablet) -->
          <button
            class="flex size-10 items-center justify-center rounded-full border border-ink/10 text-silver/80 transition-all duration-300 hover:border-jade-soft/40 hover:text-jade lg:hidden"
            :aria-expanded="isOpen"
            @click="isOpen = !isOpen"
          >
            <span class="sr-only">{{ t('nav.menu') }}</span>
            <Menu v-if="!isOpen" class="size-5" :stroke-width="1.5" />
            <X v-else class="size-5" :stroke-width="1.5" />
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
