import { describe, expect, it } from 'vitest'

import { clientCreateSchema } from './index.js'

describe('clientCreateSchema', () => {
    it('usa NEW como estado por defecto', () => {
        expect(clientCreateSchema.parse({ name: 'Ana Rojas', source: 'WEB' }).status).toBe('NEW')
    })

    it('guarda como null los textos opcionales vacíos', () => {
        const result = clientCreateSchema.parse({
            company: '  ',
            email: '',
            jobTitle: '',
            name: 'Ana Rojas',
            source: 'WEB',
        })

        expect([result.company, result.email, result.jobTitle]).toEqual([null, null, null])
    })

    it('normaliza el correo a minúsculas', () => {
        expect(clientCreateSchema.parse({ email: 'Ana@Empresa.COM', name: 'Ana Rojas', source: 'WEB' }).email).toBe(
            'ana@empresa.com',
        )
    })

    it('rechaza un teléfono con letras', () => {
        expect(clientCreateSchema.safeParse({ name: 'Ana Rojas', phone: 'abc123', source: 'WEB' }).success).toBe(false)
    })
})
