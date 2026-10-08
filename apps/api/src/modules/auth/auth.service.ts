import type { AuthLoginInput, AuthSession } from '@windkode/shared'

import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import argon2 from 'argon2'

import type { User as UserRecord } from '../../generated/prisma/client.js'
import type { AccessTokenPayload, AuthIssueResult } from './auth.types.js'

import { PrismaService } from '../../providers/prisma/prisma.service.js'
import { toUser } from '../users/users.mapper.js'
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_MS } from './auth.constant.js'
import { generateRefreshToken, hashRefreshToken } from './auth.util.js'

const INVALID_CREDENTIALS = 'Correo o contraseña incorrectos'
const INVALID_SESSION = 'Tu sesión expiró. Inicia sesión de nuevo.'

@Injectable()
export class AuthService {
    /** Hash de referencia para verificar aunque el correo no exista: el tiempo de respuesta no revela qué correos hay. */
    private dummyHash?: Promise<string>

    private readonly logger = new Logger(AuthService.name)

    constructor(
        private readonly jwt: JwtService,
        private readonly prisma: PrismaService,
    ) {}

    async login(input: AuthLoginInput, userAgent: string | undefined): Promise<AuthIssueResult> {
        const user = await this.prisma.user.findUnique({ where: { email: input.email } })
        const isValid = await argon2.verify(user?.passwordHash ?? (await this.getDummyHash()), input.password)

        if (!user || !isValid) throw new UnauthorizedException(INVALID_CREDENTIALS)
        if (!user.isActive) throw new UnauthorizedException('Tu cuenta está desactivada. Habla con un administrador.')

        return this.issue(user, userAgent)
    }

    async logout(refreshToken: string | undefined): Promise<void> {
        if (!refreshToken) return

        await this.prisma.session.updateMany({
            data: { revokedAt: new Date() },
            where: { revokedAt: null, tokenHash: hashRefreshToken(refreshToken) },
        })
    }

    async me(userId: string): Promise<AuthSession['user']> {
        const user = await this.prisma.user.findUnique({ where: { id: userId } })

        if (!user?.isActive) throw new UnauthorizedException(INVALID_SESSION)

        return toUser(user)
    }

    /** Rota el refresh token: el anterior queda revocado. Si llega uno ya revocado, se asume robo y se cierran todas las sesiones. */
    async refresh(refreshToken: string | undefined, userAgent: string | undefined): Promise<AuthIssueResult> {
        if (!refreshToken) throw new UnauthorizedException(INVALID_SESSION)

        const session = await this.prisma.session.findUnique({
            include: { user: true },
            where: { tokenHash: hashRefreshToken(refreshToken) },
        })

        if (!session) throw new UnauthorizedException(INVALID_SESSION)

        if (session.revokedAt) {
            this.logger.warn(`Revoked refresh token reused, revoking all sessions of user ${session.userId}`)
            await this.prisma.session.updateMany({
                data: { revokedAt: new Date() },
                where: { revokedAt: null, userId: session.userId },
            })
            throw new UnauthorizedException(INVALID_SESSION)
        }

        if (session.expiresAt <= new Date() || !session.user.isActive) throw new UnauthorizedException(INVALID_SESSION)

        await this.prisma.session.update({ data: { revokedAt: new Date() }, where: { id: session.id } })

        return this.issue(session.user, userAgent)
    }

    private getDummyHash(): Promise<string> {
        this.dummyHash ??= argon2.hash(generateRefreshToken())

        return this.dummyHash
    }

    private async issue(user: UserRecord, userAgent: string | undefined): Promise<AuthIssueResult> {
        const refreshToken = generateRefreshToken()
        const refreshExpiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
        const payload: AccessTokenPayload = { email: user.email, name: user.name, role: user.role, sub: user.id }

        const [accessToken] = await Promise.all([
            this.jwt.signAsync(payload, { expiresIn: ACCESS_TOKEN_TTL_SECONDS }),
            this.prisma.session.create({
                data: {
                    expiresAt: refreshExpiresAt,
                    tokenHash: hashRefreshToken(refreshToken),
                    userAgent: userAgent?.slice(0, 255) ?? null,
                    userId: user.id,
                },
            }),
        ])

        return { refreshExpiresAt, refreshToken, session: { accessToken, user: toUser(user) } }
    }
}
