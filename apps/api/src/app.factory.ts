import type { NestExpressApplication } from '@nestjs/platform-express'

import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import { AppModule } from './app.module.js'
import { ENV_CORS_ORIGINS } from './shared/constants/env.constant.js'

/** Crea y configura la app. Lo usan main.ts (servidor local) y la función de Vercel. */
export const createApp = async (): Promise<NestExpressApplication> => {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: false })

    // Detrás del proxy de Vercel: la IP real (para el rate limit) viene en X-Forwarded-For.
    app.set('trust proxy', 1)
    app.use(helmet())
    app.use(cookieParser())
    app.enableCors({ credentials: true, origin: ENV_CORS_ORIGINS })
    app.enableShutdownHooks()

    return app
}
