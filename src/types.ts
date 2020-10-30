import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs'
import type { MethodSchema } from './MethodSchema'

/**
 * @internal
 */
declare const sym: unique symbol

/**
 * Resolves to `true` if and only if `T` is `any`, `false` otherwise
 */
type IsAny<T> = (T extends typeof sym ? true : false) extends false
  ? false
  : true

/**
 * Resolves to `true` if and only if `T` is `unknown`, `false` otherwise
 */
type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false

type KnownOrDefault<T, K extends keyof T, D> = IsUnknown<T[K]> extends true
  ? { [_ in K]?: D }
  : IsAny<T[K]> extends true
  ? { [_ in K]?: any }
  : { [_ in K]: T[K] }

interface RequestDataTemplate {
  contentType?: string
  params?: Record<string, string | undefined>
  query?: ParsedQs
  body?: any
}

export type RequestData<
  T extends RequestDataTemplate = any
> = {} & KnownOrDefault<T, 'contentType', 'application/json'> &
  KnownOrDefault<T, 'params', {}> &
  KnownOrDefault<T, 'query', {}> &
  KnownOrDefault<T, 'body', undefined>

interface ResponseDataTemplate {
  contentType?: string
  status?: number
  body?: any
}

export type ResponseData<
  T extends ResponseDataTemplate = any
> = {} & KnownOrDefault<T, 'contentType', 'application/json'> &
  KnownOrDefault<T, 'status', 200> &
  KnownOrDefault<T, 'body', undefined>

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
  U extends ResponseData = ResponseData
> {
  (
    data: Required<T> & {
      req: Request
      res: Response
    }
  ): Promise<U>
}

export type MethodImpls<M extends MethodSchemas> = {
  [K in keyof M & keyof MethodSchemas]: M[K] extends MethodSchema<
    infer T,
    infer U
  >
    ? MethodImpl<T, U>
    : never
}

type MethodFetchArgs<T extends RequestData> = [
  data: T & {
    req?: globalThis.RequestInit
  }
]

export interface MethodFetch<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> {
  (
    ...args: {} extends T ? Partial<MethodFetchArgs<T>> : MethodFetchArgs<T>
  ): Promise<
    Required<
      | U
      | ResponseData<{
          status: 500
          body: undefined
        }>
    > & {
      res: globalThis.Response
    }
  >
}

export type MethodFetchs<M extends MethodSchemas> = {
  [K in keyof M & keyof MethodSchemas]: M[K] extends MethodSchema<
    infer T,
    infer U
  >
    ? MethodFetch<T, U>
    : never
}

export interface FetchRouteOptions {
  pathPrefix?: string
}
