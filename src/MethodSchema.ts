import type { RequestData, ResponseData } from './types'

export interface MethodSchema<T extends RequestData, U extends ResponseData> {
  requestData: T
  responseData: U
}

export function MethodSchema<
  T extends RequestData,
  U extends ResponseData
>(): MethodSchema<T, U> {
  return 1 as never
}
