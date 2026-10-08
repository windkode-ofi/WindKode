import type { z } from 'zod'

import type {
    clientActivityCreateSchema,
    clientCreateSchema,
    clientListQuerySchema,
    clientUpdateSchema,
} from '../schemas/client.js'
import type { UserSummary } from './user.js'

/** Contacto del CRM: una persona dentro de una empresa, con el estado de la relación comercial. */
export interface Client {
    company: null | string
    createdAt: string
    email: null | string
    id: string
    jobTitle: null | string
    lastActivityAt: null | string
    name: string
    notes: null | string
    owner: UserSummary
    phone: null | string
    source: ClientSource
    status: ClientStatus
    updatedAt: string
    /** Valor a agregar: qué le aporta WindKode a este cliente; base para armar la propuesta. */
    valueProposition: null | string
}

/** Interacción registrada con un cliente (llamada, reunión, mensaje...). */
export interface ClientActivity {
    author: UserSummary
    createdAt: string
    id: string
    occurredAt: string
    summary: string
    type: ClientActivityType
}

export type ClientActivityCreateInput = z.infer<typeof clientActivityCreateSchema>
export type ClientActivityCreateRequest = z.input<typeof clientActivityCreateSchema>

export type ClientActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'WHATSAPP'
export type ClientCreateInput = z.infer<typeof clientCreateSchema>
export type ClientCreateRequest = z.input<typeof clientCreateSchema>
export type ClientListQueryInput = z.infer<typeof clientListQuerySchema>
export type ClientListQueryRequest = z.input<typeof clientListQuerySchema>
export type ClientSource = 'OTHER' | 'REFERRAL' | 'SOCIAL' | 'WEB' | 'WHATSAPP'
/** Estado de la relación: si se habló, si está interesado, si aceptó o rechazó. */
export type ClientStatus = 'ACCEPTED' | 'CONTACTED' | 'INTERESTED' | 'NEW' | 'NO_RESPONSE' | 'REJECTED'
export type ClientSummary = Pick<Client, 'company' | 'id' | 'name'>
export type ClientUpdateInput = z.infer<typeof clientUpdateSchema>
export type ClientUpdateRequest = z.input<typeof clientUpdateSchema>
