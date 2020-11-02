import type { ParsedQs } from 'qs'
import type { MethodSchema } from './MethodSchema'

/**
 * @internal
 */
declare const phantom: unique symbol

/**
 * Resolves to `true` if and only if `T` is `any`, `false` otherwise.
 */
type IsAny<T> = (T extends typeof phantom ? true : false) extends false
  ? false
  : true

/**
 * Resolves to `true` if and only if `T` is `unknown`, `false` otherwise.
 */
type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false

type KnownOrDefault<T, K extends keyof T, D> = IsUnknown<T[K]> extends true
  ? { [_ in K]?: D }
  : D extends T[K]
  ? { [_ in K]?: T[K] }
  : { [_ in K]: T[K] }

interface RequestDataTemplate {
  /**
   * The content type of the request body.
   *
   * @default 'application/json'
   */
  contentType?: string
  /**
   * The path parameters of the request.
   *
   * @default {}
   */
  params?: Record<string, string | undefined>
  /**
   * The query parameters of the request.
   *
   * @default {}
   */
  query?: ParsedQs
  /**
   * The body of the request.
   *
   * @default undefined
   */
  body?: any
}

/**
 * Describes type information of request data based on {@linkcode RequestDataTemplate}.
 *
 * #### Example
 *
 * ```ts
 * RequestData<{
 *   contentType: 'application/json'
 *   params: { id: string }
 *   query: { name: string }
 * }>
 * ```
 */
export type RequestData<T extends RequestDataTemplate = RequestDataTemplate> = (
  IsAny<T> extends true
    ? true
    : keyof T extends keyof RequestDataTemplate
    ? true
    : false
) extends true
  ? {} & KnownOrDefault<T, 'contentType', 'application/json'> &
      KnownOrDefault<T, 'params', {}> &
      KnownOrDefault<T, 'query', {}> &
      KnownOrDefault<T, 'body', undefined>
  : void

interface ResponseDataTemplate {
  /**
   * The content type of the response body.
   *
   * @default 'application/json'
   */
  contentType?: string
  /**
   * The HTTP status code of the response.
   *
   * @default 200
   */
  status?: number
  /**
   * The body of the response.
   *
   * @default undefined
   */
  body?: any
}

/**
 * Describes type information of response data based on {@linkcode ResponseDataTemplate}.
 *
 * #### Example
 *
 * ```ts
 * ResponseData<{
 *   status: 200 | 404
 *   body: { content: string }
 * }>
 * ```
 */
export type ResponseData<
  T extends ResponseDataTemplate = ResponseDataTemplate
> = (
  IsAny<T> extends true
    ? true
    : keyof T extends keyof ResponseDataTemplate
    ? true
    : false
) extends true
  ? {} & KnownOrDefault<T, 'contentType', 'application/json'> &
      KnownOrDefault<T, 'status', 200> &
      KnownOrDefault<T, 'body', undefined>
  : void

export interface MethodSchemas {
  get?: MethodSchema<RequestData, ResponseData>
  post?: MethodSchema<RequestData, ResponseData>
  put?: MethodSchema<RequestData, ResponseData>
  delete?: MethodSchema<RequestData, ResponseData>
  patch?: MethodSchema<RequestData, ResponseData>
  options?: MethodSchema<RequestData, ResponseData>
  head?: MethodSchema<RequestData, ResponseData>
}

export interface MethodImpl<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData,
  Tr = unknown,
  Ur = unknown
> {
  (
    data: Required<T> & {
      /**
       * Contains the request object as given by the server library.
       */
      req: Tr
      /**
       * Contains the response object as given by the server library.
       */
      res: Ur
    }
  ): Promise<U>
}

export type MethodImpls<M extends MethodSchemas, Tr, Ur> = {
  [K in keyof M & keyof MethodSchemas]: M[K] extends MethodSchema<
    infer T,
    infer U
  >
    ? MethodImpl<T, U, Tr, Ur>
    : never
}

type SupportedContentType =
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'text/plain'

type MethodFetchArgs<T extends RequestData> = [
  data: T & {
    /**
     * You can specify further `fetch` options here.
     */
    req?: RequestInit
  }
]

export interface MethodFetch<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> {
  (
    ...args: [{}] extends MethodFetchArgs<T>
      ? Partial<MethodFetchArgs<T>>
      : MethodFetchArgs<T>
  ): Promise<
    Required<
      (
        | (U['contentType'] extends SupportedContentType | undefined
            ? U
            : Omit<U, 'body'> & {
                /**
                 * Unsupported content types do not have a populated `body` field.
                 * Please use one of [`fetch`'s body consumption
                 * functions](https://developer.mozilla.org/en-US/docs/Web/API/Body).
                 *
                 * #### Example
                 *
                 * ```ts
                 * if (response.contentType === 'application/octet-stream') {
                 *   let buf = await response.res.arrayBuffer()
                 * }
                 * ```
                 */
                body: U['body'] | undefined
              })
        | ResponseData<{
            /**
             * Empty body with status 500 will be sent in case of uncaught errors.
             */
            status: 500
            /**
             * Empty body with status 500 will be sent in case of uncaught errors.
             */
            body: undefined
          }>
      ) & {
        /**
         * The response object as returned by `fetch`.
         */
        res: Response
      }
    >
  >
}

export interface RouteFetcherOptions {
  /**
   * Will be prefixed to the path when creating the URL for the HTTP request.
   *
   * @default ''
   */
  pathPrefix?: string
}
