<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import { useI18n } from "vue-i18n";
import { Mail } from "@lucide/vue";
import { WLogo, WhatsAppIcon } from "@/components/ui";
import { SocialLinks } from "@/components/shared";
import { useContact } from "@/composables/useContact";
import { useScrollProgress } from "@/composables/useScrollProgress";

const { t } = useI18n();
const { email, mailtoHref, whatsappHref, whatsappDisplay } = useContact();
const year = new Date().getFullYear();

// Letras gigantes de la marca que suben una a una al llegar al final de la página.
const footer = ref<HTMLElement | null>(null);
const progress = useScrollProgress(footer, [1, 1]);
const letters = "WINDKODE".split("");
const letterStyles = computed(() =>
  letters.map((_, i) => {
    const start = 0.1 + i * 0.06;
    const p = Math.min(1, Math.max(0, (progress.value - start) / 0.4));
    return { transform: `translateY(${(1 - p) * 100}%) rotate(${(1 - p) * 12}deg)` };
  }),
);

const links = [
  { to: "/servicios", label: "nav.servicios" },
  { to: "/nosotros", label: "nav.nosotros" },
  { to: "/equipo", label: "nav.equipo" },
  { to: "/agenda", label: "nav.agenda" },
];
</script>

<template>
  <footer ref="footer" class="relative overflow-hidden border-t border-ink/5 bg-abyss">
    <div class="mx-auto max-w-7xl px-6 py-14">
      <div
        class="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start"
      >
        <div class="flex flex-col items-center gap-3 md:items-start">
          <RouterLink
            to="/"
            class="flex items-center gap-3 text-ink transition-opacity hover:opacity-80"
          >
            <WLogo class="h-8 w-9" />
            <span class="font-display text-2xl tracking-[0.18em]"
              >WIND<span class="text-steel">KODE</span></span
            >
          </RouterLink>
          <p class="text-xs uppercase tracking-[0.2em] text-silver/40">
            {{ t("footer.tagline") }}
          </p>
          <div class="mt-2 flex flex-col items-center gap-2 text-xs text-silver/50 md:items-start">
            <a
              :href="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 transition-colors hover:text-jade"
            >
              <WhatsAppIcon class="size-3.5" />
              {{ whatsappDisplay }}
            </a>
            <a :href="mailtoHref" class="inline-flex items-center gap-2 transition-colors hover:text-jade">
              <Mail class="size-3.5" :stroke-width="1.5" />
              {{ email }}
            </a>
          </div>
        </div>

        <ul class="flex flex-wrap items-center justify-center gap-6">
          <li v-for="link in links" :key="link.to">
            <RouterLink
              :to="link.to"
              class="text-xs font-medium uppercase tracking-[0.2em] text-silver/50 transition-colors hover:text-jade"
            >
              {{ t(link.label) }}
            </RouterLink>
          </li>
        </ul>
      </div>

      <div
        class="mt-10 grid grid-cols-1 items-center gap-5 border-t border-ink/5 pt-8 text-xs text-silver/40 md:grid-cols-3"
      >
        <p class="text-center md:text-left">{{ t("footer.copyright", { year }) }}</p>
        <p class="text-center">
          {{ t("footer.hecho") }}
          <span class="text-jade-soft">&lt; / &gt;</span>
          {{ t("footer.hecho_sufijo") }}
        </p>
        <SocialLinks size="sm" class="justify-center md:justify-end" />
      </div>
    </div>

    <p
      aria-hidden="true"
      class="pointer-events-none flex select-none justify-center px-4 font-display text-[21vw] uppercase leading-[0.78] text-ink/[0.05]"
    >
      <span v-for="(letter, i) in letters" :key="i" class="inline-block overflow-hidden">
        <span class="inline-block origin-bottom-left will-change-transform" :class="i >= 4 && 'text-outline'" :style="letterStyles[i]">
          {{ letter }}
        </span>
      </span>
    </p>
  </footer>
</template>
