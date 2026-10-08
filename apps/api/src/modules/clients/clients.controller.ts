import type {
    Client,
    ClientActivity,
    ClientActivityCreateInput,
    ClientCreateInput,
    ClientListQueryInput,
    ClientSummary,
    ClientUpdateInput,
    Paginated,
} from '@windkode/shared'

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
import {
    clientActivityCreateSchema,
    clientCreateSchema,
    clientListQuerySchema,
    clientUpdateSchema,
    idParamSchema,
} from '@windkode/shared'

import type { AuthUser } from '../auth/auth.types.js'

import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe.js'
import { AuthGuard } from '../auth/auth.guard.js'
import { CurrentUser } from '../auth/current-user.decorator.js'
import { RoleGuard } from '../auth/role.guard.js'
import { Roles } from '../auth/roles.decorator.js'
import { ClientsService } from './clients.service.js'

const idPipe = new ZodValidationPipe(idParamSchema)

@Controller('clients')
@UseGuards(AuthGuard, RoleGuard)
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Get()
    findAll(
        @Query(new ZodValidationPipe(clientListQuerySchema)) query: ClientListQueryInput,
    ): Promise<Paginated<Client>> {
        return this.clientsService.findAll(query)
    }

    // Antes que ':id' para que "options" no se tome como un id.
    @Get('options')
    findOptions(): Promise<ClientSummary[]> {
        return this.clientsService.findOptions()
    }

    @Get(':id')
    findOne(@Param(idPipe) { id }: { id: string }): Promise<Client> {
        return this.clientsService.findOne(id)
    }

    @Post()
    create(
        @Body(new ZodValidationPipe(clientCreateSchema)) input: ClientCreateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<Client> {
        return this.clientsService.create(input, actor)
    }

    @Patch(':id')
    update(
        @Param(idPipe) { id }: { id: string },
        @Body(new ZodValidationPipe(clientUpdateSchema)) input: ClientUpdateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<Client> {
        return this.clientsService.update(id, input, actor)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @Roles(['ADMIN'])
    remove(@Param(idPipe) { id }: { id: string }, @CurrentUser() actor: AuthUser): Promise<void> {
        return this.clientsService.remove(id, actor)
    }

    @Get(':id/activities')
    findActivities(@Param(idPipe) { id }: { id: string }): Promise<ClientActivity[]> {
        return this.clientsService.findActivities(id)
    }

    @Post(':id/activities')
    addActivity(
        @Param(idPipe) { id }: { id: string },
        @Body(new ZodValidationPipe(clientActivityCreateSchema)) input: ClientActivityCreateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<ClientActivity> {
        return this.clientsService.addActivity(id, input, actor)
    }
}
