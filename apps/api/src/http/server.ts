import { env } from '@repo/env'
import { app } from './app'

app.listen({ port: env.SERVER_PORT, host: '0.0.0.0' }).then(() => {
  app.log.info(`🚀 HTTP server running on port ${env.SERVER_PORT}`)
})