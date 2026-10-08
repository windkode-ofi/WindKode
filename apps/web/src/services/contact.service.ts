import type { ContactForm } from '@/types/project'

export interface MailtoOptions {
  to: string
  subject: string
}

/**
 * Construye el enlace `mailto:` con el formulario ya redactado.
 * El envío ocurre en el cliente de correo del visitante: no hay backend.
 */
export function buildContactMailto(data: ContactForm, { to, subject }: MailtoOptions): string {
  const body = [
    `Nombre: ${data.name.trim()}`,
    `Email: ${data.email.trim()}`,
    '',
    data.message.trim(),
  ].join('\n')

  const params = new URLSearchParams({
    subject: `${subject} — ${data.name.trim()}`,
    body,
  })

  // URLSearchParams codifica espacios como "+", que mailto: no interpreta.
  return `mailto:${to}?${params.toString().replaceAll('+', '%20')}`
}
