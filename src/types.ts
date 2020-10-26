import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs'
import type { RouteSchema } from './RouteSchema'

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

interface RequestDataBuilder {
  headers?: Record<string, string | string[] | undefined>
  params?: Record<string, string | undefined>
  query?: ParsedQs
  body?: any
}

export type RequestData<
  T extends RequestDataBuilder = any
> = {} & KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'params', {}> &
  KnownOrDefault<T, 'query', {}> &
  KnownOrDefault<T, 'body', undefined>

interface ResponseDataBuilder {
  status?: number
  headers?: Record<string, string | string[] | undefined>
  body?: any
}

export type ResponseData<
  T extends ResponseDataBuilder = any
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

export type RouteMethods = {
  [K in Method]?: [RequestData, ResponseData]
}

export type RouteMethodImpl<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> = (
  data: Required<T> & {
    req: Request
    res: Response
  }
) => Promise<U>

export type RouteMethodsImpl<S extends RouteSchema> = S extends RouteSchema<
  infer M
>
  ? {
      [K in keyof M]: M[K] extends [RequestData, ResponseData]
        ? RouteMethodImpl<M[K][0], M[K][1]>
        : undefined
    }
  : never

type FetchRouteMethodImplParam<T> = [
  T & {
    req?: globalThis.RequestInit
  }
]

export type FetchRouteMethodImpl<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> = (
  ...data: {} extends T
    ? Partial<FetchRouteMethodImplParam<T>>
    : FetchRouteMethodImplParam<T>
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

export type FetchRouteMethodsImpl<
  S extends RouteSchema
> = S extends RouteSchema<infer M>
  ? {
      [K in keyof M]: M[K] extends [RequestData, ResponseData]
        ? FetchRouteMethodImpl<M[K][0], M[K][1]>
        : undefined
    }
  : never

export interface FetchRouteOptions {
  pathPrefix?: string
}
