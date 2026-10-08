import type { User, UserCreateInput, UserUpdateInput } from '@windkode/shared'

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import argon2 from 'argon2'

import type { AuthUser } from '../auth/auth.types.js'

import { PrismaService } from '../../providers/prisma/prisma.service.js'
import { AuditService } from '../audit/audit.service.js'
import { toUser } from './users.mapper.js'

@Injectable()
export class UsersService {
    constructor(
        private readonly audit: AuditService,
        private readonly prisma: PrismaService,
    ) {}

    async create(input: UserCreateInput, actor: AuthUser): Promise<User> {
        const existing = await this.prisma.user.findUnique({ select: { id: true }, where: { email: input.email } })

        if (existing) throw new ConflictException('Ya existe un usuario con ese correo')

        const passwordHash = await argon2.hash(input.password)

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { email: input.email, name: input.name, passwordHash, role: input.role },
            })

            await this.audit.record(tx, {
                action: 'user.create',
                actorId: actor.id,
                data: { email: user.email, role: user.role },
                entity: 'user',
                entityId: user.id,
            })

            return toUser(user)
        })
    }

    async findAll(): Promise<User[]> {
        const users = await this.prisma.user.findMany({ orderBy: { name: 'asc' } })

        return users.map(toUser)
    }

    async update(id: string, input: UserUpdateInput, actor: AuthUser): Promise<User> {
        await this.findUserOrThrow(id)

        if (id === actor.id && (input.isActive === false || (input.role && input.role !== 'ADMIN'))) {
            throw new BadRequestException('No puedes desactivarte ni quitarte el rol de administrador')
        }

        const passwordHash = input.password ? await argon2.hash(input.password) : undefined

        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                data: {
                    ...(input.isActive === undefined ? {} : { isActive: input.isActive }),
                    ...(input.name ? { name: input.name } : {}),
                    ...(passwordHash ? { passwordHash } : {}),
                    ...(input.role ? { role: input.role } : {}),
                },
                where: { id },
            })

            // Desactivar o cambiar la contraseña cierra las sesiones abiertas.
            if (input.isActive === false || passwordHash)
                await tx.session.updateMany({ data: { revokedAt: new Date() }, where: { revokedAt: null, userId: id } })

            await this.audit.record(tx, {
                action: 'user.update',
                actorId: actor.id,
                data: { fields: Object.keys(input) },
                entity: 'user',
                entityId: id,
            })

            return toUser(user)
        })
    }

    private async findUserOrThrow(id: string): Promise<void> {
        const user = await this.prisma.user.findUnique({ select: { id: true }, where: { id } })

        if (!user) throw new NotFoundException('Usuario no encontrado')
    }
}
