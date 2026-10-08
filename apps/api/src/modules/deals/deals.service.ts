import type { Deal, DealCreateInput, DealMoveInput, DealUpdateInput } from '@windkode/shared'

import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { insertAtPosition } from '@windkode/shared'

import type { Prisma } from '../../generated/prisma/client.js'
import type { AuthUser } from '../auth/auth.types.js'

import { PrismaService } from '../../providers/prisma/prisma.service.js'
import { AuditService } from '../audit/audit.service.js'
import { DEAL_INCLUDE, toDeal } from './deals.mapper.js'

const DEAL_NOT_FOUND = 'Oportunidad no encontrada'

@Injectable()
export class DealsService {
    constructor(
        private readonly audit: AuditService,
        private readonly prisma: PrismaService,
    ) {}

    /** Crea la tarjeta al final de su columna. */
    async create(input: DealCreateInput, actor: AuthUser): Promise<Deal> {
        await this.findClientOrThrow(input.clientId)

        return this.prisma.$transaction(async (tx) => {
            const position = await tx.deal.count({ where: { stage: input.stage } })
            const deal = await tx.deal.create({
                data: {
                    amount: input.amount,
                    clientId: input.clientId,
                    currency: input.currency,
                    expectedCloseAt: input.expectedCloseAt ?? null,
                    ownerId: actor.id,
                    position,
                    stage: input.stage,
                    title: input.title,
                },
                include: DEAL_INCLUDE,
            })

            await this.audit.record(tx, {
                action: 'deal.create',
                actorId: actor.id,
                data: { amount: input.amount, currency: input.currency },
                entity: 'deal',
                entityId: deal.id,
            })

            return toDeal(deal)
        })
    }

    async findAll(clientId?: string): Promise<Deal[]> {
        const deals = await this.prisma.deal.findMany({
            include: DEAL_INCLUDE,
            orderBy: [{ stage: 'asc' }, { position: 'asc' }],
            where: clientId ? { clientId } : {},
        })

        return deals.map(toDeal)
    }

    /** Mueve la tarjeta a otra etapa o posición y renumera las columnas afectadas en la misma transacción. */
    async move(id: string, input: DealMoveInput, actor: AuthUser): Promise<Deal> {
        const current = await this.findDealOrThrow(id)

        return this.prisma.$transaction(async (tx) => {
            const target = await tx.deal.findMany({
                orderBy: { position: 'asc' },
                select: { id: true },
                where: { stage: input.stage },
            })
            const targetOrder = insertAtPosition(
                target.map((deal) => deal.id),
                id,
                input.position,
            )

            await tx.deal.update({ data: { stage: input.stage }, where: { id } })
            await this.renumber(tx, targetOrder)

            if (current.stage !== input.stage) {
                const source = await tx.deal.findMany({
                    orderBy: { position: 'asc' },
                    select: { id: true },
                    where: { stage: current.stage },
                })

                await this.renumber(
                    tx,
                    source.map((deal) => deal.id),
                )
            }

            await this.audit.record(tx, {
                action: 'deal.move',
                actorId: actor.id,
                data: { from: current.stage, position: input.position, to: input.stage },
                entity: 'deal',
                entityId: id,
            })

            return toDeal(await tx.deal.findUniqueOrThrow({ include: DEAL_INCLUDE, where: { id } }))
        })
    }

    /** Solo el responsable o un administrador puede borrar una oportunidad. */
    async remove(id: string, actor: AuthUser): Promise<void> {
        const deal = await this.findDealOrThrow(id)

        if (actor.role !== 'ADMIN' && deal.ownerId !== actor.id)
            throw new ForbiddenException('Solo el responsable o un administrador puede eliminar esta oportunidad')

        await this.prisma.$transaction(async (tx) => {
            await tx.deal.delete({ where: { id } })

            const column = await tx.deal.findMany({
                orderBy: { position: 'asc' },
                select: { id: true },
                where: { stage: deal.stage },
            })

            await this.renumber(
                tx,
                column.map((item) => item.id),
            )
            await this.audit.record(tx, { action: 'deal.delete', actorId: actor.id, entity: 'deal', entityId: id })
        })
    }

    async update(id: string, input: DealUpdateInput, actor: AuthUser): Promise<Deal> {
        await this.findDealOrThrow(id)

        if (input.clientId) await this.findClientOrThrow(input.clientId)

        return this.prisma.$transaction(async (tx) => {
            const deal = await tx.deal.update({ data: input, include: DEAL_INCLUDE, where: { id } })

            await this.audit.record(tx, {
                action: 'deal.update',
                actorId: actor.id,
                data: { fields: Object.keys(input) },
                entity: 'deal',
                entityId: id,
            })

            return toDeal(deal)
        })
    }

    private async findClientOrThrow(clientId: string): Promise<void> {
        const client = await this.prisma.client.findUnique({ select: { id: true }, where: { id: clientId } })

        if (!client) throw new NotFoundException('Cliente no encontrado')
    }

    private async findDealOrThrow(id: string): Promise<{ ownerId: string; stage: Deal['stage'] }> {
        const deal = await this.prisma.deal.findUnique({ select: { ownerId: true, stage: true }, where: { id } })

        if (!deal) throw new NotFoundException(DEAL_NOT_FOUND)

        return deal
    }

    private async renumber(tx: Prisma.TransactionClient, orderedIds: readonly string[]): Promise<void> {
        await Promise.all(
            orderedIds.map((dealId, position) => tx.deal.update({ data: { position }, where: { id: dealId } })),
        )
    }
}
