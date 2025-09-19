import { z } from 'zod'

export const messageTemplateBodySchema = z.object({
  templateName: z.string(),
  to: z.string().min(10),
  variables: z.object({
    // 'header' é um objeto opcional de chave-valor (string: string)
    header: z.record(z.string(), z.string()).optional(),
    // 'body' também é um objeto opcional de chave-valor
    body: z.record(z.string(), z.string()).optional(),
    // 'buttons' também é um objeto opcional de chave-valor
    buttons: z.record(z.string(), z.string()).optional(),
  }),
})

export const messageTemplateResponseSchema = z.object({
  messageId: z.string(),
})