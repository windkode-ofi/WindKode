import type { ApiError, AuthSession, GenericResponse } from '@windkode/shared'

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000').replace(/\/$/, '')

const NETWORK_ERROR = 'No pudimos conectar con el servidor. Revisa tu conexión e intenta de nuevo.'

type HttpMethod = 'DELETE' | 'GET' | 'PATCH' | 'POST'

interface RequestOptions {
    body?: unknown
    query?: Record<string, number | string | undefined>
    /** Reintento interno tras refrescar la sesión: evita bucles. */
    retried?: boolean
}

/** Puente con el store de sesión: el cliente no importa Pinia, el store se registra al crearse. */
interface SessionBridge {
    getAccessToken: () => null | string
    onRefreshed: (session: AuthSession) => void
    onSessionExpired: () => void
}

const bridge: { current: null | SessionBridge } = { current: null }

/** Un solo refresh en vuelo: las peticiones que reciben 401 mientras tanto esperan esta misma promesa (cola). */
const refreshState: { inFlight: null | Promise<AuthSession | null> } = { inFlight: null }

export const registerSessionBridge = (sessionBridge: SessionBridge): void => {
    bridge.current = sessionBridge
}

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
    const params = new URLSearchParams(
        Object.entries(query ?? {})
            .filter((entry): entry is [string, number | string] => entry[1] !== undefined && entry[1] !== '')
            .map(([key, value]) => [key, String(value)]),
    )
    const search = params.toString()

    return `${API_URL}${path}${search ? `?${search}` : ''}`
}

const parseBody = async (response: Response): Promise<unknown> => {
    if (response.status === 204) return null

    return response.json().catch(() => null)
}

const toFailure = (
    body: unknown,
): { data: null; error: string; fieldErrors?: Record<string, string[]>; success: false } => {
    const apiError = body as null | Partial<ApiError>

    return {
        data: null,
        error: apiError?.message ?? 'No se pudo completar la solicitud',
        ...(apiError?.fieldErrors ? { fieldErrors: apiError.fieldErrors } : {}),
        success: false,
    }
}

/** Pide un nuevo access token con la cookie httpOnly de refresh. Devuelve null si la sesión ya no es válida. */
export const refreshSession = (): Promise<AuthSession | null> => {
    refreshState.inFlight ??= fetch(`${API_URL}/auth/refresh`, { credentials: 'include', method: 'POST' })
        .then(async (response) => (response.ok ? ((await response.json()) as AuthSession) : null))
        .catch(() => null)
        .then((session) => {
            if (session) bridge.current?.onRefreshed(session)

            return session
        })
        .finally(() => {
            refreshState.inFlight = null
        })

    return refreshState.inFlight
}

const request = async <T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
): Promise<GenericResponse<T>> => {
    const token = bridge.current?.getAccessToken()

    const response = await fetch(buildUrl(path, options.query), {
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        credentials: 'include',
        headers: {
            ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        method,
    }).catch(() => null)

    if (!response) return { data: null, error: NETWORK_ERROR, success: false }

    // Access token vencido: un refresh (compartido) y un único reintento. Si falla, la sesión terminó.
    if (response.status === 401 && token && !options.retried) {
        const session = await refreshSession()

        if (session) return request<T>(method, path, { ...options, retried: true })

        bridge.current?.onSessionExpired()
    }

    const body = await parseBody(response)

    return response.ok ? { data: body as T, success: true } : toFailure(body)
}

/** Único cliente HTTP del panel: nadie más usa fetch directamente. */
export const httpClient = {
    delete: <T = null>(path: string): Promise<GenericResponse<T>> => request<T>('DELETE', path),
    get: <T>(path: string, query?: RequestOptions['query']): Promise<GenericResponse<T>> =>
        request<T>('GET', path, { query }),
    patch: <T>(path: string, body: unknown): Promise<GenericResponse<T>> => request<T>('PATCH', path, { body }),
    post: <T>(path: string, body?: unknown): Promise<GenericResponse<T>> => request<T>('POST', path, { body }),
}
