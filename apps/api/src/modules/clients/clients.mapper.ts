import type { Client, ClientActivity } from '@windkode/shared'

import type {
    ClientActivity as ClientActivityRecord,
    Client as ClientRecord,
    User as UserRecord,
} from '../../generated/prisma/client.js'

import { toUserSummary, USER_SUMMARY_SELECT } from '../users/users.mapper.js'

type UserSummaryRecord = Pick<UserRecord, 'email' | 'id' | 'name'>

export const CLIENT_INCLUDE = { owner: { select: USER_SUMMARY_SELECT } } as const

export const CLIENT_ACTIVITY_INCLUDE = { author: { select: USER_SUMMARY_SELECT } } as const

export const toClient = (client: { owner: UserSummaryRecord } & ClientRecord): Client => ({
    company: client.company,
    createdAt: client.createdAt.toISOString(),
    email: client.email,
    id: client.id,
    jobTitle: client.jobTitle,
    lastActivityAt: client.lastActivityAt?.toISOString() ?? null,
    name: client.name,
    notes: client.notes,
    owner: toUserSummary(client.owner),
    phone: client.phone,
    source: client.source,
    status: client.status,
    updatedAt: client.updatedAt.toISOString(),
    valueProposition: client.valueProposition,
})

export const toClientActivity = (activity: { author: UserSummaryRecord } & ClientActivityRecord): ClientActivity => ({
    author: toUserSummary(activity.author),
    createdAt: activity.createdAt.toISOString(),
    id: activity.id,
    occurredAt: activity.occurredAt.toISOString(),
    summary: activity.summary,
    type: activity.type,
})
