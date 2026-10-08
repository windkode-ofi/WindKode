import type { ClientActivityType, ClientSource, ClientStatus } from '../types/client.js'
import type { UIColor } from '../types/common.js'

export const CLIENT_SOURCE_LABEL: Record<ClientSource, string> = {
    OTHER: 'Otro',
    REFERRAL: 'Referido',
    SOCIAL: 'Redes sociales',
    WEB: 'Sitio web',
    WHATSAPP: 'WhatsApp',
}

export const CLIENT_SOURCE_COLOR: Record<ClientSource, UIColor> = {
    OTHER: 'neutral',
    REFERRAL: 'secondary',
    SOCIAL: 'info',
    WEB: 'primary',
    WHATSAPP: 'success',
}

export const CLIENT_SOURCES = [
    'OTHER',
    'REFERRAL',
    'SOCIAL',
    'WEB',
    'WHATSAPP',
] as const satisfies readonly ClientSource[]

/** Estados en el orden del flujo comercial: la posición es un dato (selects y filtros), no se ordena alfabéticamente. */
export const CLIENT_STATUSES = [
    'NEW',
    'CONTACTED',
    'INTERESTED',
    'NO_RESPONSE',
    'ACCEPTED',
    'REJECTED',
] as const satisfies readonly ClientStatus[]

export const CLIENT_STATUS_LABEL: Record<ClientStatus, string> = {
    ACCEPTED: 'Aceptó',
    CONTACTED: 'Contactado',
    INTERESTED: 'Interesado',
    NEW: 'Nuevo',
    NO_RESPONSE: 'Sin respuesta',
    REJECTED: 'Rechazó',
}

export const CLIENT_STATUS_COLOR: Record<ClientStatus, UIColor> = {
    ACCEPTED: 'success',
    CONTACTED: 'info',
    INTERESTED: 'primary',
    NEW: 'neutral',
    NO_RESPONSE: 'warning',
    REJECTED: 'error',
}

export const CLIENT_ACTIVITY_TYPES = [
    'CALL',
    'EMAIL',
    'MEETING',
    'NOTE',
    'WHATSAPP',
] as const satisfies readonly ClientActivityType[]

export const CLIENT_ACTIVITY_TYPE_LABEL: Record<ClientActivityType, string> = {
    CALL: 'Llamada',
    EMAIL: 'Correo',
    MEETING: 'Reunión',
    NOTE: 'Nota',
    WHATSAPP: 'WhatsApp',
}

/** Íconos de lucide (formato de Nuxt UI) por tipo de interacción. */
export const CLIENT_ACTIVITY_TYPE_ICON: Record<ClientActivityType, string> = {
    CALL: 'i-lucide-phone',
    EMAIL: 'i-lucide-mail',
    MEETING: 'i-lucide-users',
    NOTE: 'i-lucide-notebook-pen',
    WHATSAPP: 'i-lucide-message-circle',
}
