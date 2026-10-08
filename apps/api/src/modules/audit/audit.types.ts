import type { Prisma } from '../../generated/prisma/client.js'

export type AuditAction =
    | 'client.activity'
    | 'client.create'
    | 'client.delete'
    | 'client.update'
    | 'deal.create'
    | 'deal.delete'
    | 'deal.move'
    | 'deal.update'
    | 'user.create'
    | 'user.update'

export interface AuditEntry {
    action: AuditAction
    actorId: string
    data?: Prisma.InputJsonValue
    entity: 'client' | 'deal' | 'user'
    entityId: string
}
