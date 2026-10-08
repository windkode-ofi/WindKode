export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const REFRESH_COOKIE_NAME = 'wk_refresh'

/** La cookie solo viaja a las rutas de auth: el resto de la api usa el Bearer. */
export const REFRESH_COOKIE_PATH = '/auth'

export const LOGIN_THROTTLE = { limit: 5, ttl: 60_000 }
