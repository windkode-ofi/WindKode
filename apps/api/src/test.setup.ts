// Entorno mínimo para que las constantes ENV_* se puedan importar en los tests.
process.env.APP_ENV ??= 'development'
process.env.CORS_ORIGINS ??= 'http://localhost:5174'
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5433/test'
process.env.JWT_SECRET ??= 'secreto-de-pruebas-con-mas-de-32-caracteres'
