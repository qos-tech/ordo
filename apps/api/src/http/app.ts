import { env } from '@repo/env';
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyCors from "@fastify/cors";
import { messageTemplateRoute } from './routes/meta-api/whatsapp/message-template-route';
import { errorHandler } from './error-handler';

const loggerConfig =
  env.NODE_ENV === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
      }
    : true


export const app = fastify({logger: loggerConfig}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

if (env.NODE_ENV !== 'production') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Q-Chat - API_v2',
        description: 'Q-Chat System API v2.',
        version: '2.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })
}

app.register(fastifyCors, {
  origin: env.CORS_ORIGIN,
})

app.register(messageTemplateRoute, { prefix: '/v2' })