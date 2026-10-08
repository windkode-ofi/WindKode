import type { z } from 'zod'

import type { userCreateSchema, userUpdateSchema } from '../schemas/user.js'

export interface User {
    createdAt: string
    email: string
    id: string
    isActive: boolean
    name: string
    role: UserRole
}

export type UserCreateInput = z.infer<typeof userCreateSchema>

export type UserRole = 'ADMIN' | 'SELLER'

/** Forma reducida para mostrar al responsable de un registro. */
export type UserSummary = Pick<User, 'email' | 'id' | 'name'>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
