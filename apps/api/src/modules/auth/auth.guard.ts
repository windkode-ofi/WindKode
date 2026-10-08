import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import type { AccessTokenPayload, AuthenticatedRequest } from './auth.types.js'

/** Valida el Bearer y deja el usuario en `request.user`. Va siempre antes que RoleGuard. */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwt: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
        const [scheme, token] = request.headers.authorization?.split(' ') ?? []

        if (scheme !== 'Bearer' || !token) throw new UnauthorizedException('Inicia sesión para continuar')

        const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token).catch(() => {
            throw new UnauthorizedException('Tu sesión expiró. Inicia sesión de nuevo.')
        })

        request.user = { email: payload.email, id: payload.sub, name: payload.name, role: payload.role }

        return true
    }
}
