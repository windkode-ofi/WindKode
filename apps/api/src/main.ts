import './load-env.js'
import 'reflect-metadata'
import { Logger } from '@nestjs/common'

import { createApp } from './app.factory.js'
import { ENV_PORT } from './shared/constants/env.constant.js'

const app = await createApp()

await app.listen(ENV_PORT)
new Logger('Bootstrap').log(`API listening on http://localhost:${ENV_PORT}`)
