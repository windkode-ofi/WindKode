import { existsSync } from 'node:fs'

// Carga apps/api/.env en desarrollo. En Vercel las variables ya vienen del entorno y el archivo no existe.
// Se importa primero en main.ts: en ESM los imports se evalúan en orden, antes que las constantes ENV_*.
if (existsSync('.env')) process.loadEnvFile('.env')
