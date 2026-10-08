import type { UserRole } from '@windkode/shared'

import { Reflector } from '@nestjs/core'

/** Roles permitidos en un handler o controller. Sin el decorador, basta con estar autenticado. */
export const Roles = Reflector.createDecorator<UserRole[]>()
