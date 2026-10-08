import type { AuthLoginInput, AuthSession, User } from '@windkode/shared'
import type { CookieOptions, Request, Response } from 'express'

import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { authLoginSchema } from '@windkode/shared'

import type { AuthIssueResult, AuthUser } from './auth.types.js'

import { ENV_APP_ENV, ENV_COOKIE_SAME_SITE } from '../../shared/constants/env.constant.js'
import { ZodValidationPipe } from '../../shared/pipes/zod-validation.pipe.js'
import { LOGIN_THROTTLE, REFRESH_COOKIE_NAME, REFRESH_COOKIE_PATH } from './auth.constant.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { CurrentUser } from './current-user.decorator.js'

const COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    path: REFRESH_COOKIE_PATH,
    sameSite: ENV_COOKIE_SAME_SITE,
    // SameSite=None exige Secure; en local (http) solo se marca Secure fuera de development.
    secure: ENV_APP_ENV !== 'development' || ENV_COOKIE_SAME_SITE === 'none',
}

const readRefreshCookie = (request: Request): string | undefined =>
    (request.cookies as Record<string, string | undefined>)[REFRESH_COOKIE_NAME]

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @Throttle({ default: LOGIN_THROTTLE })
    async login(
        @Body(new ZodValidationPipe(authLoginSchema)) input: AuthLoginInput,
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ): Promise<AuthSession> {
        return this.respond(await this.authService.login(input, request.headers['user-agent']), response)
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<AuthSession> {
        return this.respond(
            await this.authService.refresh(readRefreshCookie(request), request.headers['user-agent']),
            response,
        )
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response): Promise<void> {
        await this.authService.logout(readRefreshCookie(request))
        response.clearCookie(REFRESH_COOKIE_NAME, COOKIE_OPTIONS)
    }

    @Get('me')
    @UseGuards(AuthGuard)
    me(@CurrentUser() user: AuthUser): Promise<User> {
        return this.authService.me(user.id)
    }

    private respond(result: AuthIssueResult, response: Response): AuthSession {
        response.cookie(REFRESH_COOKIE_NAME, result.refreshToken, {
            ...COOKIE_OPTIONS,
            expires: result.refreshExpiresAt,
        })

        return result.session
    }
}
