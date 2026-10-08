import { Module } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { AuditModule } from './modules/audit/audit.module.js'
import { AuthModule } from './modules/auth/auth.module.js'
import { ClientsModule } from './modules/clients/clients.module.js'
import { DealsModule } from './modules/deals/deals.module.js'
import { HealthModule } from './modules/health/health.module.js'
import { UsersModule } from './modules/users/users.module.js'
import { PrismaModule } from './providers/prisma/prisma.module.js'
import { ApiExceptionFilter } from './shared/filters/api-exception.filter.js'

@Module({
    imports: [
        ThrottlerModule.forRoot([{ limit: 120, ttl: 60_000 }]),
        PrismaModule,
        AuditModule,
        AuthModule,
        HealthModule,
        UsersModule,
        ClientsModule,
        DealsModule,
    ],
    providers: [
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_FILTER, useClass: ApiExceptionFilter },
    ],
})
export class AppModule {}
