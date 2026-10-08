import { z } from 'zod'

import { CLIENT_ACTIVITY_TYPES, CLIENT_SOURCES, CLIENT_STATUSES } from '../constants/client.js'
import { PHONE_REGEX } from '../constants/regex.js'
import { optionalTextSchema, paginationQuerySchema } from './common.js'

export const clientCreateSchema = z.object({
    company: optionalTextSchema(120, 'La empresa no puede superar 120 caracteres'),
    email: z
        .union([z.literal(''), z.email('Ingresa un correo válido').trim().toLowerCase()])
        .transform((value) => (value === '' ? null : value))
        .nullish(),
    jobTitle: optionalTextSchema(120, 'El cargo no puede superar 120 caracteres'),
    name: z
        .string()
        .trim()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(120, 'El nombre no puede superar 120 caracteres'),
    notes: optionalTextSchema(2000, 'Las notas no pueden superar 2000 caracteres'),
    phone: z
        .union([
            z.literal(''),
            z.string().trim().regex(PHONE_REGEX, 'Ingresa un teléfono válido, por ejemplo +591 75904262'),
        ])
        .transform((value) => (value === '' ? null : value))
        .nullish(),
    source: z.enum(CLIENT_SOURCES, 'Selecciona el origen del cliente'),
    status: z.enum(CLIENT_STATUSES, 'Selecciona el estado del cliente').default('NEW'),
    valueProposition: optionalTextSchema(4000, 'El valor a agregar no puede superar 4000 caracteres'),
})

export const clientUpdateSchema = clientCreateSchema.partial()

export const clientListQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim().max(120).optional(),
    status: z.enum(CLIENT_STATUSES).optional(),
})

export const clientActivityCreateSchema = z.object({
    occurredAt: z.coerce.date('Ingresa una fecha válida').optional(),
    summary: z
        .string()
        .trim()
        .min(3, 'Describe la interacción en al menos 3 caracteres')
        .max(2000, 'El resumen no puede superar 2000 caracteres'),
    type: z.enum(CLIENT_ACTIVITY_TYPES, 'Selecciona el tipo de interacción'),
})
