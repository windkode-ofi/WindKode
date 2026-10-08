import { BadRequestException } from '@nestjs/common'
import { clientCreateSchema } from '@windkode/shared'
import { describe, expect, it } from 'vitest'

import { ZodValidationPipe } from './zod-validation.pipe.js'

describe('ZodValidationPipe', () => {
    const pipe = new ZodValidationPipe(clientCreateSchema)

    it('devuelve los datos parseados cuando son válidos', () => {
        expect(pipe.transform({ name: 'Ana Rojas', source: 'WEB' })).toMatchObject({ name: 'Ana Rojas', status: 'NEW' })
    })

    it('lanza 400 con el primer mensaje en español y los errores por campo', () => {
        const error = ((): unknown => {
            try {
                return pipe.transform({ name: 'A', source: 'WEB' })
            } catch (caught) {
                return caught
            }
        })()

        expect(error).toBeInstanceOf(BadRequestException)
        expect((error as BadRequestException).getResponse()).toMatchObject({
            fieldErrors: { name: ['El nombre debe tener al menos 2 caracteres'] },
            message: 'El nombre debe tener al menos 2 caracteres',
        })
    })
})
