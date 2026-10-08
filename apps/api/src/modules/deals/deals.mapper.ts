import type { Deal } from '@windkode/shared'

import type { Client as ClientRecord, Deal as DealRecord, User as UserRecord } from '../../generated/prisma/client.js'

import { toUserSummary, USER_SUMMARY_SELECT } from '../users/users.mapper.js'

export const DEAL_INCLUDE = {
    client: { select: { company: true, id: true, name: true } },
    owner: { select: USER_SUMMARY_SELECT },
} as const

type DealWithRelations = {
    client: Pick<ClientRecord, 'company' | 'id' | 'name'>
    owner: Pick<UserRecord, 'email' | 'id' | 'name'>
} & DealRecord

export const toDeal = (deal: DealWithRelations): Deal => ({
    amount: deal.amount.toFixed(2),
    client: { company: deal.client.company, id: deal.client.id, name: deal.client.name },
    createdAt: deal.createdAt.toISOString(),
    currency: deal.currency,
    // Columna DATE: se devuelve solo la fecha (YYYY-MM-DD), sin zona horaria.
    expectedCloseAt: deal.expectedCloseAt?.toISOString().slice(0, 10) ?? null,
    id: deal.id,
    owner: toUserSummary(deal.owner),
    position: deal.position,
    stage: deal.stage,
    title: deal.title,
    updatedAt: deal.updatedAt.toISOString(),
})
