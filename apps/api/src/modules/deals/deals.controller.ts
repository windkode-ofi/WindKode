import type { Deal, DealCreateInput, DealMoveInput, DealUpdateInput } from '@windkode/shared'

import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { dealCreateSchema, dealMoveSchema, dealUpdateSchema, idParamSchema } from '@windkode/shared'
import { z } from 'zod'

import type { AuthUser } from '../auth/auth.types.js'

import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe.js'
import { AuthGuard } from '../auth/auth.guard.js'
import { CurrentUser } from '../auth/current-user.decorator.js'
import { DealsService } from './deals.service.js'

const idPipe = new ZodValidationPipe(idParamSchema)

const dealListQuerySchema = z.object({ clientId: z.uuid('Cliente inválido').optional() })

@Controller('deals')
@UseGuards(AuthGuard)
export class DealsController {
    constructor(private readonly dealsService: DealsService) {}

    @Get()
    findAll(@Query(new ZodValidationPipe(dealListQuerySchema)) query: { clientId?: string }): Promise<Deal[]> {
        return this.dealsService.findAll(query.clientId)
    }

    @Post()
    create(
        @Body(new ZodValidationPipe(dealCreateSchema)) input: DealCreateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<Deal> {
        return this.dealsService.create(input, actor)
    }

    @Patch(':id')
    update(
        @Param(idPipe) { id }: { id: string },
        @Body(new ZodValidationPipe(dealUpdateSchema)) input: DealUpdateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<Deal> {
        return this.dealsService.update(id, input, actor)
    }

    @Patch(':id/move')
    move(
        @Param(idPipe) { id }: { id: string },
        @Body(new ZodValidationPipe(dealMoveSchema)) input: DealMoveInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<Deal> {
        return this.dealsService.move(id, input, actor)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param(idPipe) { id }: { id: string }, @CurrentUser() actor: AuthUser): Promise<void> {
        return this.dealsService.remove(id, actor)
    }
}
