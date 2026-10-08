import { z } from 'zod'

import { PASSWORD_MIN_LENGTH, USER_ROLES } from '../constants/user.js'

const passwordSchema = z
    .string()
    .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`)
    .max(128, 'La contraseña no puede superar 128 caracteres')

export const userCreateSchema = z.object({
    email: z.email('Ingresa un correo válido').trim().toLowerCase(),
    name: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(120, 'El nombre no puede superar 120 caracteres'),
    password: passwordSchema,
    role: z.enum(USER_ROLES, 'Selecciona un rol'),
})

export const userUpdateSchema = z.object({
    isActive: z.boolean().optional(),
    name: userCreateSchema.shape.name.optional(),
    password: passwordSchema.optional(),
    role: userCreateSchema.shape.role.optional(),
})
