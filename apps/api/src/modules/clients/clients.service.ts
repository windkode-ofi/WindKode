import type {
    Client,
    ClientActivity,
    ClientActivityCreateInput,
    ClientCreateInput,
    ClientListQueryInput,
    ClientSummary,
    ClientUpdateInput,
    Paginated,
} from '@windkode/shared'

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import type { Prisma } from '../../generated/prisma/client.js'
import type { AuthUser } from '../auth/auth.types.js'

import { PrismaService } from '../../providers/prisma/prisma.service.js'
import { AuditService } from '../audit/audit.service.js'
import { CLIENT_ACTIVITY_INCLUDE, CLIENT_INCLUDE, toClient, toClientActivity } from './clients.mapper.js'

const CLIENT_NOT_FOUND = 'Cliente no encontrado'

@Injectable()
export class ClientsService {
    constructor(
        private readonly audit: AuditService,
        private readonly prisma: PrismaService,
    ) {}

    /** Registra una interacción. Si el cliente seguía como NEW y hubo contacto real (no una nota), pasa a CONTACTED. */
    async addActivity(clientId: string, input: ClientActivityCreateInput, actor: AuthUser): Promise<ClientActivity> {
        const client = await this.findClientOrThrow(clientId)
        const occurredAt = input.occurredAt ?? new Date()
        const shouldMarkContacted = client.status === 'NEW' && input.type !== 'NOTE'

        return this.prisma.$transaction(async (tx) => {
            const activity = await tx.clientActivity.create({
                data: { authorId: actor.id, clientId, occurredAt, summary: input.summary, type: input.type },
                include: CLIENT_ACTIVITY_INCLUDE,
            })

            await tx.client.update({
                data: {
                    ...(shouldMarkContacted ? { status: 'CONTACTED' } : {}),
                    ...(!client.lastActivityAt || occurredAt > client.lastActivityAt
                        ? { lastActivityAt: occurredAt }
                        : {}),
                },
                where: { id: clientId },
            })

            await this.audit.record(tx, {
                action: 'client.activity',
                actorId: actor.id,
                data: { activityId: activity.id, type: input.type },
                entity: 'client',
                entityId: clientId,
            })

            return toClientActivity(activity)
        })
    }

    async create(input: ClientCreateInput, actor: AuthUser): Promise<Client> {
        return this.prisma.$transaction(async (tx) => {
            const client = await tx.client.create({ data: { ...input, ownerId: actor.id }, include: CLIENT_INCLUDE })

            await this.audit.record(tx, {
                action: 'client.create',
                actorId: actor.id,
                entity: 'client',
                entityId: client.id,
            })

            return toClient(client)
        })
    }

    async findActivities(clientId: string): Promise<ClientActivity[]> {
        await this.findClientOrThrow(clientId)

        const activities = await this.prisma.clientActivity.findMany({
            include: CLIENT_ACTIVITY_INCLUDE,
            orderBy: { occurredAt: 'desc' },
            where: { clientId },
        })

        return activities.map(toClientActivity)
    }

    async findAll(query: ClientListQueryInput): Promise<Paginated<Client>> {
        const where: Prisma.ClientWhereInput = {
            ...(query.status ? { status: query.status } : {}),
            ...(query.search
                ? {
                      OR: [
                          { name: { contains: query.search, mode: 'insensitive' } },
                          { company: { contains: query.search, mode: 'insensitive' } },
                          { email: { contains: query.search, mode: 'insensitive' } },
                      ],
                  }
                : {}),
        }

        const [items, total] = await Promise.all([
            this.prisma.client.findMany({
                include: CLIENT_INCLUDE,
                orderBy: [{ updatedAt: 'desc' }],
                skip: (query.page - 1) * query.pageSize,
                take: query.pageSize,
                where,
            }),
            this.prisma.client.count({ where }),
        ])

        return { items: items.map(toClient), page: query.page, pageSize: query.pageSize, total }
    }

    async findOne(id: string): Promise<Client> {
        const client = await this.prisma.client.findUnique({ include: CLIENT_INCLUDE, where: { id } })

        if (!client) throw new NotFoundException(CLIENT_NOT_FOUND)

        return toClient(client)
    }

    /** Lista corta para los selects (p. ej. al crear una oportunidad). */
    async findOptions(): Promise<ClientSummary[]> {
        return this.prisma.client.findMany({
            orderBy: { name: 'asc' },
            select: { company: true, id: true, name: true },
        })
    }

    async remove(id: string, actor: AuthUser): Promise<void> {
        await this.findClientOrThrow(id)

        const deals = await this.prisma.deal.count({ where: { clientId: id } })

        if (deals > 0)
            throw new ConflictException(
                'El cliente tiene oportunidades de venta. Elimínalas o reasígnalas antes de borrarlo.',
            )

        await this.prisma.$transaction(async (tx) => {
            await tx.client.delete({ where: { id } })
            await this.audit.record(tx, { action: 'client.delete', actorId: actor.id, entity: 'client', entityId: id })
        })
    }

    async update(id: string, input: ClientUpdateInput, actor: AuthUser): Promise<Client> {
        await this.findClientOrThrow(id)

        return this.prisma.$transaction(async (tx) => {
            const client = await tx.client.update({ data: input, include: CLIENT_INCLUDE, where: { id } })

            await this.audit.record(tx, {
                action: 'client.update',
                actorId: actor.id,
                data: { fields: Object.keys(input) },
                entity: 'client',
                entityId: id,
            })

            return toClient(client)
        })
    }

    private async findClientOrThrow(id: string): Promise<{ lastActivityAt: Date | null; status: Client['status'] }> {
        const client = await this.prisma.client.findUnique({
            select: { lastActivityAt: true, status: true },
            where: { id },
        })

        if (!client) throw new NotFoundException(CLIENT_NOT_FOUND)

        return client
    }
}
