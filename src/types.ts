import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs'
import type { MethodSchema } from './MethodSchema'
import type { RouteSchema } from './RouteSchema'

/**
 * @internal
 */
declare const sym: unique symbol

type IsAny<T> = (T extends typeof sym ? true : false) extends false
  ? false
  : true

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
  headers?: Record<string, string | string[] | undefined>
  params?: Record<string, string | undefined>
  query?: ParsedQs
  body?: any
}

export type RequestData<
  T extends RequestDataTemplate = any
> = {} & KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'params', {}> &
  KnownOrDefault<T, 'query', {}> &
  KnownOrDefault<T, 'body', undefined>

interface ResponseDataTemplate {
  status?: number
  headers?: Record<string, string | string[] | undefined>
  body?: any
}

export type ResponseData<
  T extends ResponseDataTemplate = any
> = {} & KnownOrDefault<T, 'status', 200> &
  KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'body', undefined>

export type Method =
  | 'get'
  | 'post'
  | 'put'
  | 'delete'
  | 'patch'
  | 'options'
  | 'head'

export type MethodSchemas = {
  [K in Method]?: MethodSchema<RequestData, ResponseData>
}

export type MethodImpl<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> = (
  data: Required<T> & {
    req: Request
    res: Response
  }
) => Promise<U>

export type MethodsImpl<S extends RouteSchema> = S extends RouteSchema<infer M>
  ? {
      [K in keyof M]: M[K] extends MethodSchema<infer T, infer U>
        ? MethodImpl<T, U>
        : undefined
    }
  : never

type FetchMethodImplParam<T> = [
  T & {
    req?: globalThis.RequestInit
  }
]

export type FetchMethodImpl<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> = (
  ...data: {} extends T
    ? Partial<FetchMethodImplParam<T>>
    : FetchMethodImplParam<T>
) => Promise<
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

export type FetchMethodsImpl<S extends RouteSchema> = S extends RouteSchema<
  infer M
>
  ? {
      [K in keyof M]: M[K] extends MethodSchema<infer T, infer U>
        ? FetchMethodImpl<T, U>
        : undefined
    }
  : never

export interface FetchRouteOptions {
  pathPrefix?: string
}
