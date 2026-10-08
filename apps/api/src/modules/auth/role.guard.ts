import type { CanActivate, ExecutionContext } from '@nestjs/common'

import { ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import type { AuthenticatedRequest } from './auth.types.js'

import { Roles } from './roles.decorator.js'

/** Comprueba `@Roles(...)`. Requiere que AuthGuard haya corrido antes: `@UseGuards(AuthGuard, RoleGuard)`. */
@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()])

        if (!roles?.length) return true

        const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>()

        if (!roles.includes(user.role)) throw new ForbiddenException('No tienes permisos para realizar esta acción')

        return true
    }
}
