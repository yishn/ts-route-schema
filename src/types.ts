import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs'
import type { RouteSchema } from './RouteSchema'

declare const sym: unique symbol

export type IsAny<T> = (T extends typeof sym ? true : false) extends false
  ? false
  : true

export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
  ? true
  : false

export type KnownOrDefault<T, K extends keyof T, D> = IsUnknown<
  T[K]
> extends true
  ? { [_ in K]?: D }
  : IsAny<T[K]> extends true
  ? { [_ in K]?: any }
  : { [_ in K]: T[K] }

interface GenericRequestData {
  headers: Record<string, string | string[] | undefined>
  params: Record<string, string | undefined>
  query: ParsedQs
  body: any
}

export type RequestData<
  T extends Partial<GenericRequestData> = any
> = KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'params', {}> &
  KnownOrDefault<T, 'query', {}> &
  KnownOrDefault<T, 'body', undefined>

interface GenericResponseData {
  status: number
  headers: Record<string, string | string[] | undefined>
  body: any
}

export type ResponseData<
  T extends Partial<GenericResponseData> = any
> = KnownOrDefault<T, 'status', 200> &
  KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'body', undefined>

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

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
      [K in keyof M]: M[K] extends [infer T, infer U]
        ? T extends RequestData
          ? U extends ResponseData
            ? RouteMethodImpl<T, U>
            : undefined
          : undefined
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
      [K in keyof M]: M[K] extends [infer T, infer U]
        ? T extends RequestData
          ? U extends ResponseData
            ? FetchRouteMethodImpl<T, U>
            : undefined
          : undefined
        : undefined
    }
  : never

export interface FetchRouteOptions {
  pathPrefix?: string
}
