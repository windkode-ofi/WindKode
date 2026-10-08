import { describe, expect, it } from 'vitest'

import { dealCreateSchema, dealMoveSchema } from './index.js'

const VALID_DEAL = {
    amount: '1500.50',
    clientId: '6f1d4b8e-3c2a-4e7b-9a1d-2b3c4d5e6f70',
    currency: 'BOB',
    title: 'Landing para cafetería',
}

describe('dealCreateSchema', () => {
    describe('entrada válida', () => {
        it('usa LEAD como etapa por defecto', () => {
            expect(dealCreateSchema.parse(VALID_DEAL).stage).toBe('LEAD')
        })

        it('convierte la fecha esperada de cierre', () => {
            expect(
                dealCreateSchema.parse({ ...VALID_DEAL, expectedCloseAt: '2026-12-01' }).expectedCloseAt,
            ).toBeInstanceOf(Date)
        })
    })

    describe('entrada inválida', () => {
        it('rechaza montos con más de dos decimales', () => {
            expect(dealCreateSchema.safeParse({ ...VALID_DEAL, amount: '10.123' }).success).toBe(false)
        })

        it('rechaza monedas fuera de la lista', () => {
            expect(dealCreateSchema.safeParse({ ...VALID_DEAL, currency: 'EUR' }).success).toBe(false)
        })
    })
})

describe('dealMoveSchema', () => {
    it('rechaza posiciones negativas', () => {
        expect(dealMoveSchema.safeParse({ position: -1, stage: 'WON' }).success).toBe(false)
    })
})
