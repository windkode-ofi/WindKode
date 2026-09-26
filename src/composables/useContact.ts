import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { CONTACT_EMAIL, WHATSAPP_NUMBER, SOCIAL_LINKS } from '@/config/contact'
import { buildContactMailto } from '@/services'
import type { ContactForm } from '@/types/project'

export type ContactStatus = 'idle' | 'sent'

/**
 * Punto único de acceso a los canales de contacto (email, WhatsApp y formulario).
 * Los enlaces se recalculan al cambiar de idioma porque el mensaje
 * predeterminado de WhatsApp y el asunto del mail salen de i18n.
 */
export function useContact() {
  const { t } = useI18n()

  const email = CONTACT_EMAIL
  const whatsappNumber = WHATSAPP_NUMBER
  const whatsappDisplay = `+${WHATSAPP_NUMBER}`
  const socials = SOCIAL_LINKS

  const whatsappHref = computed(
    () => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(t('contacto.whatsapp_mensaje'))}`,
  )

  const mailtoHref = computed(
    () => `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t('contacto.email_asunto'))}`,
  )

  const status = ref<ContactStatus>('idle')

  /** Abre el cliente de correo del visitante con el formulario ya redactado. */
  function send(data: ContactForm) {
    window.location.href = buildContactMailto(data, {
      to: CONTACT_EMAIL,
      subject: t('contacto.email_asunto'),
    })
    status.value = 'sent'
  }

  function reset() {
    status.value = 'idle'
  }

  return { email, whatsappNumber, whatsappDisplay, whatsappHref, mailtoHref, socials, status, send, reset }
}
