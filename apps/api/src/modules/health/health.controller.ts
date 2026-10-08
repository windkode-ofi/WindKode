import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'

import { PrismaService } from '../../providers/prisma/prisma.service.js'

@Controller('health')
export class HealthController {
    constructor(private readonly prisma: PrismaService) {}

    @Get()
    async check(): Promise<{ database: 'ok'; status: 'ok' }> {
        try {
            await this.prisma.$queryRaw`SELECT 1`
        } catch {
            throw new ServiceUnavailableException('La base de datos no responde')
        }

        return { database: 'ok', status: 'ok' }
    }
}
