import { describe, expect, it } from 'vitest'

import { formatDate, toDateTimeLocalValue } from './date'

describe('formatDate', () => {
    it('devuelve un guion cuando no hay fecha', () => {
        expect(formatDate(null)).toBe('—')
    })

    it('no cambia de día con fechas sin hora', () => {
        expect(formatDate('2026-12-01')).toContain('1')
        expect(formatDate('2026-12-01')).not.toContain('30')
    })
})

describe('toDateTimeLocalValue', () => {
    it('devuelve el formato que espera datetime-local', () => {
        expect(toDateTimeLocalValue(new Date())).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    })
})
