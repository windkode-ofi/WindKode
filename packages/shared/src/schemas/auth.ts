import { z } from 'zod'

export const authLoginSchema = z.object({
    email: z.email('Ingresa un correo válido').trim().toLowerCase(),
    password: z.string().min(1, 'Ingresa tu contraseña'),
})
