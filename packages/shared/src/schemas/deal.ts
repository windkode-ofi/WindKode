import { z } from 'zod'

import { CURRENCIES, DEAL_STAGES } from '../constants/deal.js'
import { DECIMAL_AMOUNT_REGEX } from '../constants/regex.js'

export const dealCreateSchema = z.object({
    amount: z.string().trim().regex(DECIMAL_AMOUNT_REGEX, 'Ingresa un monto válido, con hasta 2 decimales'),
    clientId: z.uuid('Selecciona un cliente'),
    currency: z.enum(CURRENCIES, 'Selecciona la moneda'),
    expectedCloseAt: z.coerce.date('Ingresa una fecha válida').nullish(),
    stage: z.enum(DEAL_STAGES, 'Selecciona una etapa').default('LEAD'),
    title: z
        .string()
        .trim()
        .min(3, 'El título debe tener al menos 3 caracteres')
        .max(160, 'El título no puede superar 160 caracteres'),
})

export const dealUpdateSchema = dealCreateSchema.omit({ stage: true }).partial()

/** Mover una tarjeta del kanban: etapa destino e índice dentro de esa columna. */
export const dealMoveSchema = z.object({
    position: z.number().int().min(0, 'Posición inválida'),
    stage: z.enum(DEAL_STAGES, 'Selecciona una etapa'),
})
