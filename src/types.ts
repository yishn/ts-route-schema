import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs'

declare const sym: unique symbol

export type IsAny<T> = (T extends typeof sym ? true : false) extends false
  ? false
  : true

export type IsUnknown<T> = IsAny<T> extends false
  ? unknown extends T
    ? true
    : false
  : false

export type KnownOrDefault<T, K extends keyof T, D> = IsUnknown<
  T[K]
> extends true
  ? Partial<Record<K, D>>
  : IsAny<T[K]> extends true
  ? Partial<Record<K, any>>
  : Record<K, T[K]>

interface GenericRequestData {
  headers: Record<string, string | string[] | undefined>
  params: Record<string, string>
  query: ParsedQs
  body: any
}

export type RequestData<
  T extends Partial<GenericRequestData> = any
> = KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'params', {}> &
  KnownOrDefault<T, 'query', {}> &
  KnownOrDefault<T, 'body', void>

interface GenericResponseData {
  status: number
  headers: Record<string, string | string[] | undefined>
  body: any
}

export type ResponseData<
  T extends Partial<GenericResponseData> = any
> = KnownOrDefault<T, 'status', 200> &
  KnownOrDefault<T, 'headers', {}> &
  KnownOrDefault<T, 'body', void>

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

export type RouteMethods = {
  [K in Method]?: (data: RequestData) => ResponseData
}

export interface RouteSchema<M extends RouteMethods = any> {
  path: string
  methods: M
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
      [K in keyof M]: M[K] extends (data: infer T) => infer U
        ? T extends RequestData
          ? U extends ResponseData
            ? RouteMethodImpl<T, U>
            : undefined
          : undefined
        : undefined
    }
  : never

export type FetchRouteMethodImpl<
  T extends RequestData = RequestData,
  U extends ResponseData = ResponseData
> = (
  data: T & {
    req?: globalThis.RequestInit
  }
) => Promise<
  Required<U | ResponseData<{ status: 500 }>> & {
    res: globalThis.Response
  }
>

export type FetchRouteMethodsImpl<
  S extends RouteSchema
> = S extends RouteSchema<infer M>
  ? {
      [K in keyof M]: M[K] extends (data: infer T) => infer U
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
