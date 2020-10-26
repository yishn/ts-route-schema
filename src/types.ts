import type { Request, Response } from 'express'
import type { ParsedQs } from 'qs'

declare const sym: unique symbol

export type IsAny<T> = boolean extends (T extends typeof sym ? true : false)
  ? true
  : false

export type IsUnknown<T> = IsAny<T> extends false
  ? unknown extends T
    ? true
    : false
  : false

export type KnownOrDefault<T, D> = IsUnknown<T> extends true ? D : T

interface GenericRequestData {
  headers: Record<string, string | string[] | undefined>
  params: Record<string, string>
  query: ParsedQs
  body: any
}

export interface RequestData<T extends Partial<GenericRequestData> = any> {
  headers: KnownOrDefault<T['headers'], {}>
  params: KnownOrDefault<T['params'], {}>
  query: KnownOrDefault<T['query'], {}>
  body: KnownOrDefault<T['body'], void>
}

interface GenericResponseData {
  status: number
  headers: Record<string, string | string[] | undefined>
  body: any
}

export interface ResponseData<T extends Partial<GenericResponseData> = any> {
  status: KnownOrDefault<T['status'], number>
  headers: KnownOrDefault<T['headers'], {}>
  body: KnownOrDefault<T['body'], void>
}

export const methods = ['get', 'post', 'put', 'patch', 'delete'] as const

export type RouteSchemaMethods = {
  [K in typeof methods[number]]?: (data: RequestData) => ResponseData
}

export interface RouteSchema<M extends RouteSchemaMethods = any> {
  path: string
  methods: M
}

export type RouteMethodsImpl<S extends RouteSchema> = S extends RouteSchema<
  infer M
>
  ? {
      [K in keyof M]: M[K] extends (
        data: RequestData<infer T>
      ) => ResponseData<infer U>
        ? (
            data: RequestData<T> & {
              req: Request
              res: Response
            }
          ) => Promise<Partial<ResponseData<U>>>
        : undefined
    }
  : never
