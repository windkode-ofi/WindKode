export interface User {
    createdAt: string
    email: string
    id: string
    isActive: boolean
    name: string
    role: UserRole
}

export type UserRole = 'ADMIN' | 'SELLER'

/** Forma reducida para mostrar al responsable de un registro. */
export type UserSummary = Pick<User, 'email' | 'id' | 'name'>
