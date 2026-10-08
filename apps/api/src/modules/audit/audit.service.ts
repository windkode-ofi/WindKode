import { Injectable } from '@nestjs/common'

import type { Prisma } from '../../generated/prisma/client.js'
import type { AuditEntry } from './audit.types.js'

/** Escribe el registro de auditoría con el cliente de la transacción en curso, para que se guarde junto al cambio. */
@Injectable()
export class AuditService {
    async record(tx: Prisma.TransactionClient, entry: AuditEntry): Promise<void> {
        await tx.auditLog.create({
            data: {
                action: entry.action,
                actorId: entry.actorId,
                entity: entry.entity,
                entityId: entry.entityId,
                ...(entry.data ? { data: entry.data } : {}),
            },
        })
    }
}
