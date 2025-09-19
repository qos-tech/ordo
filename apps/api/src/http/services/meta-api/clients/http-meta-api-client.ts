import { env } from '@repo/env'
import ky, { HTTPError } from 'ky'
import { MetaApiErrorResponse, MetaApiResponse } from '../types'

import { MetaApiError } from '../../_errors/meta-api-errors'

export class HttpMetaApiClient {
  private readonly apiClient = ky.create({
    prefixUrl: 'https://graph.facebook.com',
    hooks: {
      beforeRequest: [
        (request) => {
          const url = new URL(request.url)
          const apiVersion = env.META_API_VERSION || 'v20.0'
          url.pathname = `/${apiVersion}${url.pathname}`
          return new Request(url, request)
        },
      ],
    },
  })

  async post(
    endpoint: string,
    payload: Record<string, any>,
  ): Promise<MetaApiResponse> {
    try {
      return await this.apiClient
        .post(endpoint, {
          headers: { Authorization: `Bearer ${env.META_API_TOKEN}` },
          json: payload,
        })
        .json<MetaApiResponse>()
    } catch (error) {
      if (error instanceof HTTPError) {
        // Tentamos ler o corpo do erro como o nosso tipo esperado
        const errorBody = (await error.response.json()) as MetaApiErrorResponse
        const errorMessage =
          errorBody.error?.message || 'Unknown error from Meta API'

        // Lançamos o nosso erro personalizado com a mensagem e o status code corretos
        throw new MetaApiError(errorMessage, error.response.status)
      }

      // Se o erro não for um erro HTTP (ex: problema de rede), relançamo-lo
      throw error
    }
  }
}
