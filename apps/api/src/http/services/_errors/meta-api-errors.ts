export class MetaApiError extends Error {
  public readonly statusCode: number

  constructor(message: string, statusCode = 400) {
    super(message)
    this.name = 'MetaApiError'
    this.statusCode = statusCode
  }
}