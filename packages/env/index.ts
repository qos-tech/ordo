import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url(),
    CORS_ORIGIN: z.string().url(),
    NODE_ENV: z.string().default('development'),
    META_API_VERSION: z.string().default('v23.0'),
    META_API_TOKEN: z.string().min(1),
  },
  client: {},
  shared: {},
  runtimeEnv: {
    SERVER_PORT: process.env.SERVER_PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    NODE_ENV: process.env.NODE_ENV,
    META_API_VERSION: process.env.META_API_VERSION,
    META_API_TOKEN: process.env.META_API_TOKEN,
  },
  emptyStringAsUndefined: true,
})

