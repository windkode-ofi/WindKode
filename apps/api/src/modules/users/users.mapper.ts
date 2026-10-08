import type { User, UserSummary } from '@windkode/shared'

import type { User as UserRecord } from '../../generated/prisma/client.js'

export const toUser = (user: UserRecord): User => ({
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    id: user.id,
    isActive: user.isActive,
    name: user.name,
    role: user.role,
})

/** Campos de Prisma para seleccionar un `UserSummary`. */
export const USER_SUMMARY_SELECT = { email: true, id: true, name: true } as const

export const toUserSummary = (user: Pick<UserRecord, 'email' | 'id' | 'name'>): UserSummary => ({
    email: user.email,
    id: user.id,
    name: user.name,
})
