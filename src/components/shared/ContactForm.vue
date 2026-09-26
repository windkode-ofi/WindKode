<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { CheckCircle2, Send } from '@lucide/vue'
import { AppButton } from '@/components/ui'
import { useContact } from '@/composables/useContact'

const { t } = useI18n()
const { status, send, reset, whatsappHref, mailtoHref, email } = useContact()

const form = reactive({
  name: '',
  email: '',
  message: '',
})

function handleSubmit() {
  send({ ...form })
}

function handleReset() {
  form.name = ''
  form.email = ''
  form.message = ''
  reset()
}
</script>

<template>
  <form v-if="status === 'idle'" class="mx-auto max-w-lg space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="mb-2 block text-sm font-medium text-silver">{{ t('formulario.nombre.label') }}</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        name="name"
        autocomplete="name"
        required
        class="w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-ink placeholder-steel/60 outline-none transition-all focus:border-jade-soft focus:bg-jade/[0.04] focus:shadow-[0_0_0_3px_var(--jade-glow)]"
        :placeholder="t('formulario.nombre.placeholder')"
      />
    </div>

    <div>
      <label for="email" class="mb-2 block text-sm font-medium text-silver">{{ t('formulario.email.label') }}</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        name="email"
        autocomplete="email"
        required
        class="w-full rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-ink placeholder-steel/60 outline-none transition-all focus:border-jade-soft focus:bg-jade/[0.04] focus:shadow-[0_0_0_3px_var(--jade-glow)]"
        :placeholder="t('formulario.email.placeholder')"
      />
    </div>

    <div>
      <label for="message" class="mb-2 block text-sm font-medium text-silver">{{ t('formulario.mensaje.label') }}</label>
      <textarea
        id="message"
        v-model="form.message"
        name="message"
        required
        rows="5"
        class="w-full resize-none rounded-xl border border-ink/10 bg-ink/5 px-4 py-3 text-ink placeholder-steel/60 outline-none transition-all focus:border-jade-soft focus:bg-jade/[0.04] focus:shadow-[0_0_0_3px_var(--jade-glow)]"
        :placeholder="t('formulario.mensaje.placeholder')"
      ></textarea>
    </div>

    <AppButton type="submit" variant="primary" size="lg" class="btn-shine w-full">
      <Send class="size-4" :stroke-width="1.5" />
      {{ t('formulario.enviar') }}
    </AppButton>

    <p class="text-center text-xs text-silver/50">
      {{ t('formulario.alternativa') }}
      <a :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="underline decoration-ink/20 underline-offset-4 transition-colors hover:text-jade">WhatsApp</a>
      ·
      <a :href="mailtoHref" class="underline decoration-ink/20 underline-offset-4 transition-colors hover:text-jade">{{ email }}</a>
    </p>
  </form>

  <div v-else class="text-center" role="status">
    <CheckCircle2 class="mx-auto size-10 text-jade" :stroke-width="1.5" />
    <p class="mt-4 text-lg text-ink">{{ t('formulario.exito.titulo') }}</p>
    <p class="mt-2 text-silver/60">{{ t('formulario.exito.mensaje') }}</p>
    <button
      type="button"
      class="mt-6 cursor-pointer text-xs uppercase tracking-[0.2em] text-silver/50 transition-colors hover:text-jade"
      @click="handleReset"
    >
      {{ t('formulario.nuevo') }}
    </button>
  </div>
</template>
