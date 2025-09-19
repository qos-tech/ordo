import { TemplateVariables } from '../types'

export class TemplatePayloadBuilder {
  /**
   * Constrói o payload completo para a API da Meta, incluindo os nomes dos parâmetros.
   * @param to - O número de telefone do destinatário.
   * @param templateName - O nome do template a ser usado.
   * @param variables - Um objeto contendo as variáveis para 'header' e 'body'.
   * @returns O objeto de payload pronto para ser enviado como JSON.
   */
  build(
    to: string,
    templateName: string,
    variables: TemplateVariables,
  ): Record<string, any> {
    const components = []

    // Função auxiliar para criar o array de parâmetros com chave e valor
    const createParameters = (vars: Record<string, string>) => {
      // Usamos Object.entries para obter [chave, valor]
      return Object.entries(vars).map(([key, value]) => ({
        type: 'text',
        parameter_name: key, // A chave se torna o nome do parâmetro
        text: value,         // O valor se torna o texto do parâmetro
      }))
    }

    // Processa as variáveis do cabeçalho, se existirem
    if (variables.header && Object.keys(variables.header).length > 0) {
      components.push({
        type: 'header',
        parameters: createParameters(variables.header),
      })
    }

    // Processa as variáveis do corpo, se existirem
    if (variables.body && Object.keys(variables.body).length > 0) {
      components.push({
        type: 'body',
        parameters: createParameters(variables.body),
      })
    }

    // Retorna a estrutura completa do payload, exatamente como a Meta espera
    return {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: 'pt_BR' },
        components,
      },
    }
  }
}

