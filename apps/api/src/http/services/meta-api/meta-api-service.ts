import type { TemplatePayloadBuilder } from './builders/template-payload-builder'
import type { HttpMetaApiClient } from './clients/http-meta-api-client'
import { MetaApiResponse, TemplateVariables } from './types'

export class MetaApiService {
  constructor(
    private readonly apiClient: HttpMetaApiClient ,
    private readonly payloadBuilder: TemplatePayloadBuilder,
  ) {}

  async sendTemplateMessage(
    fromPhoneId: string,
    to: string,
    templateName: string,
    variables: TemplateVariables,
  ): Promise<MetaApiResponse> {
    const endpoint = `${fromPhoneId}/messages`

    const payload = this.payloadBuilder.build(to, templateName, variables)

    return this.apiClient.post(endpoint, payload)
  }
}
