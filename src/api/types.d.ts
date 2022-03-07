export type BankseaApiPageQuery = {
  size?: number
  current?: number
}

export interface BankseaApiPageResult<T> {
  records: T[]
  total: number
  size: number
  current: number
  orders: unknown[]
  optimizeCountSql: boolean
  hitCount: boolean
  searchCount: boolean
  pages: number
}

export type BankseaApiResponseBody<T> = {
  code: number
  data: T
  message: string
  success: boolean
}
