<script setup lang="ts">
import { SocialIcon } from '@/components/ui'
import { useContact } from '@/composables/useContact'
import { useI18n } from 'vue-i18n'

/**
 * Fila de iconos de redes sociales. Se usa en el hero, el footer y la agenda,
 * así que cualquier red nueva en `SOCIAL_LINKS` aparece en los tres sitios.
 */
withDefaults(
  defineProps<{
    /** sm = footer, md = hero y agenda */
    size?: 'sm' | 'md'
    /** Muestra el texto "Síguenos" a la izquierda de los iconos */
    label?: boolean
  }>(),
  { size: 'md', label: false },
)

const { t } = useI18n()
const { socials } = useContact()
</script>

<template>
  <div class="flex items-center gap-4">
    <span v-if="label" class="text-xs font-medium uppercase tracking-[0.3em] text-steel">
      {{ t('contacto.redes') }}
    </span>
    <ul class="flex items-center gap-3" :aria-label="t('contacto.redes')">
      <li v-for="social in socials" :key="social.key">
        <a
          :href="social.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="social.label"
          :title="social.label"
          class="group flex items-center justify-center rounded-full border border-ink/10 text-silver/60 transition-all duration-300 hover:-translate-y-0.5 hover:border-jade-soft/50 hover:bg-jade/5 hover:text-jade"
          :class="size === 'sm' ? 'size-8' : 'size-10'"
        >
          <SocialIcon :name="social.key" :class="size === 'sm' ? 'size-3.5' : 'size-4'" />
        </a>
      </li>
    </ul>
  </div>
</template>
