import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { messageTemplateBodySchema, messageTemplateResponseSchema } from './_schemas'
import { auth } from '@/http/middlewares/auth'
import { TemplatePayloadBuilder } from '@/http/services/meta-api/builders/template-payload-builder'
import { HttpMetaApiClient } from '@/http/services/meta-api/clients/http-meta-api-client'
import { MetaApiService } from '@/http/services/meta-api/meta-api-service'

export async function messageTemplateRoute (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).post(
    '/message/template',
    {
      schema: {
        tags: ['Meta API'],
        summary: 'Sends a message using a pre-approved template',
        security: [{ bearerAuth: [] }],
        body: messageTemplateBodySchema,
        response: { 201: messageTemplateResponseSchema }
      },
    },
    async (request, reply) => {
      const { companyId, metaNumberId } = request.auth

      const { templateName, to, variables } = request.body

      // 3. Instanciamos as nossas classes de serviço (Injeção de Dependência manual)
      const payloadBuilder = new TemplatePayloadBuilder()
      const apiClient = new HttpMetaApiClient()
      const metaApiService = new MetaApiService(apiClient, payloadBuilder)

      app.log.info(`Sending template "${templateName}" to ${to}`)

      // 4. Chamamos o serviço orquestrador com os dados necessários
      const response = await metaApiService.sendTemplateMessage(
        metaNumberId,
        to,
        templateName,
        variables,
      )

      // 5. Extraímos o ID da mensagem da resposta da Meta para retornar ao cliente
      const messageId = response?.messages?.[0]?.id

      if (!messageId) {
        app.log.error({ response }, 'Could not extract message ID from Meta API response.')
        // Lançamos um erro que será apanhado pelo nosso error handler global
        throw new Error('Failed to send message: Invalid response from Meta API.')
      }

      return reply.status(201).send({ messageId })
    },
  )
}