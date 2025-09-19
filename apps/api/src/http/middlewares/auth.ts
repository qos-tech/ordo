import { prisma, type Whatsapps } from '@repo/db'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyInstance, FastifyRequest } from 'fastify'

import { UnauthorizedError } from '../routes/_errors/unauthorized-error'

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.decorate('tokenCache', new Map<string, Whatsapps>())

  app.addHook('preHandler', async (request: FastifyRequest) => {
    const tokenCache = request.server.tokenCache

    try {
      const token = request.headers.authorization?.replace('Bearer ', '')

      if (!token) {
        throw new UnauthorizedError('Token not provided.')
      }

      if (tokenCache.has(token)) {
        request.auth = tokenCache.get(token)!
        return
      }

      const connectionData = await prisma.whatsapps.findFirst({
        where: { token },
      })

      if (!connectionData) {
        throw new UnauthorizedError('Invalid token.')
      }

      tokenCache.set(token, connectionData)
      setTimeout(() => tokenCache.delete(token), 5 * 60 * 1000)

      request.auth = connectionData
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error
      }

      throw new UnauthorizedError('Authentication process failed.')
    }
  })
})
