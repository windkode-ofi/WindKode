import type { AuthSession, UserRole } from '@windkode/shared'
import type { Request } from 'express'

export interface AccessTokenPayload {
    email: string
    name: string
    role: UserRole
    sub: string
}

export interface AuthenticatedRequest extends Request {
    user: AuthUser
}

/** Resultado interno de login/refresh: la sesión va al body y el refresh token a la cookie. */
export interface AuthIssueResult {
    refreshExpiresAt: Date
    refreshToken: string
    session: AuthSession
}

/** Usuario autenticado que el AuthGuard deja en `request.user`. */
export interface AuthUser {
    email: string
    id: string
    name: string
    role: UserRole
}
