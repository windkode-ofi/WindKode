import type { OnModuleDestroy } from '@nestjs/common'

import { Injectable } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../../generated/prisma/client.js'
import { ENV_DATABASE_URL } from '../../shared/constants/env.constant.js'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
    constructor() {
        super({ adapter: new PrismaPg({ connectionString: ENV_DATABASE_URL }) })
    }

    async onModuleDestroy(): Promise<void> {
        await this.$disconnect()
    }
}
