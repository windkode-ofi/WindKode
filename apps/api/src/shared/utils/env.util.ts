const ENV_HELP = 'Copia apps/api/.env.example a apps/api/.env o define la variable en Vercel.'

/** Lee una variable obligatoria; si falta, la app no arranca y el mensaje dice cuál y cómo arreglarlo. */
export const requireEnv = (name: string): string => {
    const value = process.env[name]?.trim()

    if (!value) throw new Error(`Falta la variable de entorno ${name}. ${ENV_HELP}`)

    return value
}

/** Lee una variable cuyo valor debe ser uno de los permitidos. */
export const requireEnvOneOf = <T extends string>(name: string, allowed: readonly T[], fallback?: T): T => {
    const value = process.env[name]?.trim() ?? fallback

    if (!value) throw new Error(`Falta la variable de entorno ${name}. ${ENV_HELP}`)
    if (!allowed.includes(value as T))
        throw new Error(`${name}="${value}" no es válido. Valores permitidos: ${allowed.join(', ')}.`)

    return value as T
}
