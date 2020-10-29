import type { RequestData, ResponseData } from './types'

/**
 * @internal
 */
declare const sym: unique symbol

export interface MethodSchema<T extends RequestData, U extends ResponseData> {
  /**
   * @internal
   */
  [sym]?: [T, U]
}

/**
 * Represents the type information on the request and response data of an HTTP
 * method described in a route schema
 *
 * @template T - Represents type information on the request data
 * @template U - Represents type information on the response data
 */
export function MethodSchema<
  T extends RequestData,
  U extends ResponseData
>(): MethodSchema<T, U> {
  return 1 as never
}
