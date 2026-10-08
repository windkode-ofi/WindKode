import type { User, UserCreateInput, UserUpdateInput } from '@windkode/shared'

import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { idParamSchema, userCreateSchema, userUpdateSchema } from '@windkode/shared'

import type { AuthUser } from '../auth/auth.types.js'

import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe.js'
import { AuthGuard } from '../auth/auth.guard.js'
import { CurrentUser } from '../auth/current-user.decorator.js'
import { RoleGuard } from '../auth/role.guard.js'
import { Roles } from '../auth/roles.decorator.js'
import { UsersService } from './users.service.js'

@Controller('users')
@Roles(['ADMIN'])
@UseGuards(AuthGuard, RoleGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll()
    }

    @Post()
    create(
        @Body(new ZodValidationPipe(userCreateSchema)) input: UserCreateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<User> {
        return this.usersService.create(input, actor)
    }

    @Patch(':id')
    update(
        @Param(new ZodValidationPipe(idParamSchema)) { id }: { id: string },
        @Body(new ZodValidationPipe(userUpdateSchema)) input: UserUpdateInput,
        @CurrentUser() actor: AuthUser,
    ): Promise<User> {
        return this.usersService.update(id, input, actor)
    }
}
