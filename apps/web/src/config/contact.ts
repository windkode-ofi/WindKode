/**
 * Datos de contacto de WindKode.
 * Se pueden sobreescribir por entorno (VITE_*) sin tocar el código.
 * WHATSAPP_NUMBER va en formato internacional sin "+" ni espacios (E.164),
 * tal como lo exige https://wa.me.
 */
export const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'windkode@gmail.com'
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '59175904262'

export type SocialNetwork = 'instagram' | 'facebook' | 'linkedin'

export interface SocialLink {
  key: SocialNetwork
  label: string
  href: string
}

/** Redes sociales oficiales (URLs sin parámetros de seguimiento). */
export const SOCIAL_LINKS: SocialLink[] = [
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/windkode/' },
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1B9j2nfj35/' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/company/windkode/' },
]
