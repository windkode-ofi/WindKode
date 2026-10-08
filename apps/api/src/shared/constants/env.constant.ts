import { requireEnv, requireEnvOneOf } from '../utils/env.util.js'

export const ENV_APP_ENV = requireEnvOneOf('APP_ENV', ['development', 'preview', 'production'] as const)

export const ENV_CORS_ORIGINS = requireEnv('CORS_ORIGINS')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)

export const ENV_COOKIE_SAME_SITE = requireEnvOneOf('COOKIE_SAME_SITE', ['lax', 'none', 'strict'] as const, 'lax')

export const ENV_DATABASE_URL = requireEnv('DATABASE_URL')

export const ENV_JWT_SECRET = ((secret: string) => {
    if (secret.length < 32) throw new Error('JWT_SECRET debe tener al menos 32 caracteres (openssl rand -base64 48).')

    return secret
})(requireEnv('JWT_SECRET'))

export const ENV_PORT = Number(process.env.PORT ?? 4000)
