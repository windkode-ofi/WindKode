import type { PipeTransform } from '@nestjs/common'

import { BadRequestException, Injectable } from '@nestjs/common'
import { z } from 'zod'

/** Valida un parámetro (@Body, @Query, @Param) con un schema de @windkode/shared. Se usa por parámetro, nunca con @UsePipes. */
@Injectable()
export class ZodValidationPipe<TSchema extends z.ZodType> implements PipeTransform<unknown, z.output<TSchema>> {
    constructor(private readonly schema: TSchema) {}

    transform(value: unknown): z.output<TSchema> {
        const result = this.schema.safeParse(value)

        if (result.success) return result.data

        const { fieldErrors } = z.flattenError(result.error)

        throw new BadRequestException({
            fieldErrors,
            message: result.error.issues[0]?.message ?? 'Los datos enviados no son válidos',
        })
    }
}
