/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
    /** URL base de la api (apps/api). */
    readonly VITE_API_URL?: string
}
