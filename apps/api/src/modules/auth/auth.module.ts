import { Global, Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { ENV_JWT_SECRET } from '../../shared/constants/env.constant.js'
import { AuthController } from './auth.controller.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import { RoleGuard } from './role.guard.js'

/** Global: AuthGuard, RoleGuard y JwtService quedan disponibles para los demás módulos. */
@Global()
@Module({
    imports: [
        JwtModule.register({
            secret: ENV_JWT_SECRET,
            signOptions: { algorithm: 'HS256' },
            verifyOptions: { algorithms: ['HS256'] },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthGuard, AuthService, RoleGuard],
    exports: [AuthGuard, JwtModule, RoleGuard],
})
export class AuthModule {}
