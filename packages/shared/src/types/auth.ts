import type { z } from 'zod'

import type { authLoginSchema } from '../schemas/auth.js'
import type { User } from './user.js'

export type AuthLoginInput = z.infer<typeof authLoginSchema>

/** Respuesta de login y refresh: el refresh token viaja aparte, en una cookie httpOnly. */
export interface AuthSession {
    accessToken: string
    user: User
}
