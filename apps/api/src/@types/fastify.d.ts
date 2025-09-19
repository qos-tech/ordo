import { Whatsapps } from '@prisma/client';

declare module 'fastify' {
  export interface FastifyInstance {
    tokenCache: Map<string, Whatsapps>
  }
  
  export interface FastifyRequest {
    auth: Whatsapps;
  }
}