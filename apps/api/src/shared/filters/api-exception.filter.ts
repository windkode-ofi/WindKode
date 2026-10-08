import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import type { ApiError } from '@windkode/shared'
import type { Response } from 'express'

import { Catch, HttpException, HttpStatus, Logger, NotFoundException } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'

import { Prisma } from '../../generated/prisma/client.js'

/** Mensajes en español para los errores conocidos de Prisma. */
const PRISMA_ERRORS: Record<string, { message: string; statusCode: number }> = {
    P2002: { message: 'Ya existe un registro con esos datos', statusCode: HttpStatus.CONFLICT },
    P2003: {
        message: 'No se puede completar: el registro está relacionado con otros datos',
        statusCode: HttpStatus.CONFLICT,
    },
    P2025: { message: 'No encontramos el registro solicitado', statusCode: HttpStatus.NOT_FOUND },
}

const toHttpError = (exception: HttpException): ApiError => {
    const statusCode = exception.getStatus()
    const body = exception.getResponse()
    const raw =
        typeof body === 'string'
            ? body
            : (body as { fieldErrors?: Record<string, string[]>; message?: string | string[] })
    const message = typeof raw === 'string' ? raw : Array.isArray(raw.message) ? raw.message.join('. ') : raw.message
    const fieldErrors = typeof raw === 'string' ? undefined : raw.fieldErrors

    if (exception instanceof ThrottlerException)
        return { message: 'Demasiados intentos. Espera un momento y vuelve a intentar.', statusCode }
    // Rutas inexistentes: Nest responde "Cannot GET /x" en inglés.
    if (exception instanceof NotFoundException && message?.startsWith('Cannot '))
        return { message: 'La ruta solicitada no existe', statusCode }

    return {
        ...(fieldErrors ? { fieldErrors } : {}),
        message: message ?? 'No se pudo completar la solicitud',
        statusCode,
    }
}

/** Único canal de errores hacia los clientes: siempre `ApiError` con el mensaje en español. */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(ApiExceptionFilter.name)

    catch(exception: unknown, host: ArgumentsHost): void {
        const response = host.switchToHttp().getResponse<Response>()
        const error = this.resolve(exception)

        response.status(error.statusCode).json(error)
    }

    private resolve(exception: unknown): ApiError {
        if (exception instanceof HttpException) return toHttpError(exception)

        if (exception instanceof Prisma.PrismaClientKnownRequestError) {
            const known = PRISMA_ERRORS[exception.code]

            if (known) return known
        }

        this.logger.error('Unhandled exception', exception instanceof Error ? exception.stack : String(exception))

        return {
            message: 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.',
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }
    }
}
