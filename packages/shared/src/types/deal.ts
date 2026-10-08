import type { z } from 'zod'

import type { dealCreateSchema, dealMoveSchema, dealUpdateSchema } from '../schemas/deal.js'
import type { ClientSummary } from './client.js'
import type { UserSummary } from './user.js'

export type Currency = 'BOB' | 'USD'

/** Oportunidad de venta: una tarjeta del kanban. `amount` es un decimal en string para no perder precisión. */
export interface Deal {
    amount: string
    client: ClientSummary
    createdAt: string
    currency: Currency
    expectedCloseAt: null | string
    id: string
    owner: UserSummary
    position: number
    stage: DealStage
    title: string
    updatedAt: string
}

export type DealCreateInput = z.infer<typeof dealCreateSchema>

export type DealCreateRequest = z.input<typeof dealCreateSchema>
export type DealMoveInput = z.infer<typeof dealMoveSchema>
export type DealStage = 'CONTACTED' | 'LEAD' | 'LOST' | 'NEGOTIATION' | 'PROPOSAL' | 'WON'
export type DealUpdateInput = z.infer<typeof dealUpdateSchema>
export type DealUpdateRequest = z.input<typeof dealUpdateSchema>
