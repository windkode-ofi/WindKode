/** Error que devuelve la api: `message` siempre en español y apto para mostrar al usuario. */
export interface ApiError {
    fieldErrors?: Record<string, string[]>
    message: string
    statusCode: number
}

/** Respuesta normalizada de los services del cliente: nunca lanzan, la UI decide con `success`. */
export type GenericResponse<T = null> =
    | { data: null; error: string; fieldErrors?: Record<string, string[]>; success: false }
    | { data: T; error?: string; success: true }

/** Página de resultados de un listado. */
export interface Paginated<T> {
    items: T[]
    page: number
    pageSize: number
    total: number
}

/** Colores semánticos de Nuxt UI usados por los mapas `_COLOR`. */
export type UIColor = 'error' | 'info' | 'neutral' | 'primary' | 'secondary' | 'success' | 'warning'
