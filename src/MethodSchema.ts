import type { RequestData, ResponseData } from './types'

/**
 * @internal
 */
declare const phantom: unique symbol

/**
 * Use `MethodSchema<T, U>()` to declare this interface.
 */
export interface MethodSchema<T extends RequestData, U extends ResponseData> {
  /**
   * @internal
   */
  [phantom]?: [T, U]
}

/**
 * Represents the type information on the request and response data of an HTTP
 * method described in a route schema.
 *
 * #### Example
 *
 * ```ts
 * MethodSchema<
 *   RequestData<{
 *     query: { name: string }
 *   }>,
 *   ResponseData<{
 *     body: { message: string }
 *   }>
 * >()
 * ```
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
