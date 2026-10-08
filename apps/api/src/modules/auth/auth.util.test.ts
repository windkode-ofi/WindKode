import { describe, expect, it } from 'vitest'

import { generateRefreshToken, hashRefreshToken } from './auth.util.js'

describe('generateRefreshToken', () => {
    it('genera tokens distintos en cada llamada', () => {
        expect(generateRefreshToken()).not.toBe(generateRefreshToken())
    })

    it('usa solo caracteres seguros para una cookie', () => {
        expect(generateRefreshToken()).toMatch(/^[\w-]{64}$/)
    })
})

describe('hashRefreshToken', () => {
    it('es determinista y no expone el token', () => {
        const token = generateRefreshToken()

        expect(hashRefreshToken(token)).toBe(hashRefreshToken(token))
        expect(hashRefreshToken(token)).not.toContain(token)
    })
})
