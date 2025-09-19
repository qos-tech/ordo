export interface TemplateVariables {
    header?: Record<string, string>
    body?: Record<string, string>
    buttons?: Record<string, string>
}

export interface MetaApiResponse {
    messaging_product: string
    contacts: { input: string; wa_id: string }[]
    messages: { id: string; message_status: string }[]
}

export interface MetaApiErrorResponse {
  error: {
    message: string
    type?: string
    code?: number
    fbtrace_id?: string
  }
}