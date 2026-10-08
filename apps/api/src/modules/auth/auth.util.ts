import { createHash, randomBytes } from 'node:crypto'

/** Refresh token opaco: 48 bytes aleatorios en base64url. */
export const generateRefreshToken = (): string => randomBytes(48).toString('base64url')

/** En la base solo se guarda el hash: un volcado de la tabla no permite iniciar sesión. */
export const hashRefreshToken = (token: string): string => createHash('sha256').update(token).digest('hex')
