import type { UIColor } from '../types/common.js'
import type { UserRole } from '../types/user.js'

export const USER_ROLE_LABEL: Record<UserRole, string> = {
    ADMIN: 'Administrador',
    SELLER: 'Vendedor',
}

export const USER_ROLE_COLOR: Record<UserRole, UIColor> = {
    ADMIN: 'primary',
    SELLER: 'neutral',
}

export const USER_ROLES = ['ADMIN', 'SELLER'] as const satisfies readonly UserRole[]

/** Largo mínimo de contraseña, compartido por el schema y los mensajes de la UI. */
export const PASSWORD_MIN_LENGTH = 8
