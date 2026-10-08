import { describe, expect, it } from 'vitest'

import { formatMoney, sumAmounts } from './index.js'

describe('formatMoney', () => {
    it('formatea bolivianos con dos decimales', () => {
        expect(formatMoney('1500', 'BOB')).toContain('1.500,00')
    })

    it('acepta números además de strings', () => {
        expect(formatMoney(99.5, 'USD')).toContain('99,50')
    })

    it('devuelve un guion si el monto no es numérico', () => {
        expect(formatMoney('abc', 'BOB')).toBe('—')
    })
})

describe('sumAmounts', () => {
    it('suma sin error de coma flotante', () => {
        expect(sumAmounts(['0.10', '0.20'])).toBe('0.30')
    })

    it('devuelve 0.00 con una lista vacía', () => {
        expect(sumAmounts([])).toBe('0.00')
    })
})
