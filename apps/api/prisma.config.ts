import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// El CLI (migrate, studio, seed) usa la conexión directa; la app en runtime usa DATABASE_URL (pooler).
export default defineConfig({
    datasource: { url: env('DIRECT_URL') },
    migrations: { path: 'prisma/migrations', seed: 'tsx prisma/seed.ts' },
    schema: 'prisma/schema',
})
