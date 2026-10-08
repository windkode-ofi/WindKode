import { z } from 'zod'

export const idParamSchema = z.object({
    id: z.uuid('Identificador inválido'),
})

export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

/** Texto opcional: string vacío o solo espacios se guarda como `null`. */
export const optionalTextSchema = (max: number, message: string) =>
    z
        .string()
        .trim()
        .max(max, message)
        .transform((value) => (value === '' ? null : value))
        .nullish()
