import type {Request, Response} from 'express-serve-static-core'
import type {Route, routeSym} from './Route'
import type {Declare} from './util'

declare const typeFormatSym: unique symbol
declare const contentTypeSym: unique symbol
declare const statusCodeSym: unique symbol

type DeepStringValues<T> = {
  [K in keyof T]: T[K] extends object ? DeepStringValues<T[K]> : string & Declare<T[K]>
}

export type TypedValue = number | string | boolean

export interface TypedParams {
  [key: string]: TypedValue
}

export interface TypedQuery {
  [key: string]: TypedValue | TypedValue[] | TypedQuery | TypedQuery[]
}

export interface RouteOptions<
  M extends string = string,
  Pt extends string = string,
  Pm extends TypedParams = TypedParams,
  R extends StatusCode<any> = any,
  B = any,
  Q extends TypedQuery = TypedQuery
> {
  method: M,
  path: Pt,
  responseBody?: Declare<R>,
  requestBody?: Declare<B>,
  params?: Declare<Pm>,
  query?: Declare<Q>
}

export interface TypeFormat<F extends string> {
  [typeFormatSym]?: F
}
export interface ContentType<C extends string> {
  [contentTypeSym]?: C
}
type StatusCodeRange = 'default' | '1XX' | '2XX' | '3XX' | '4XX' | '5XX'
export interface StatusCode<S extends number | StatusCodeRange> {
  [statusCodeSym]?: S
}

export interface RouteFunction<F extends Function = any, O extends RouteOptions = RouteOptions> {
  [routeSym]: Route<F, O>
}

export type MethodFromRouteOptions<O> =
  O extends RouteOptions<infer M> ? M : never
export type PathFromRouteOptions<O> =
  O extends RouteOptions<any, infer Pt> ? Pt : never
export type ParamsFromRouteOptions<O> =
  O extends RouteOptions<any, any, infer Pm> ? DeepStringValues<Pm> : never
export type ResBodyFromRouteOptions<O> =
  O extends RouteOptions<any, any, any, infer R> ? R : never
export type ReqBodyFromRouteOptions<O> =
  O extends RouteOptions<any, any, any, any, infer B> ? B : never
export type QueryFromRouteOptions<O> =
  O extends RouteOptions<any, any, any, any, any, infer Q> ? DeepStringValues<Q> : never

export type RequestFromRouteOptions<O> =
  Request<
    ParamsFromRouteOptions<O>,
    ResBodyFromRouteOptions<O>,
    ReqBodyFromRouteOptions<O>,
    QueryFromRouteOptions<O>
  >
export type ResponseFromRouteOptions<O> = Response<ResBodyFromRouteOptions<O>>
export interface RouteHandler<F extends Function = any, O extends RouteOptions = RouteOptions> {
  (
    func: F,
    req: RequestFromRouteOptions<O>,
    res: ResponseFromRouteOptions<O>
  ): Promise<ResBodyFromRouteOptions<O> | void>
}

export type RouteOptionsFromRouteFunction<F extends RouteFunction> =
  F[typeof routeSym] extends Route<any, infer O> ? O : never

export type MethodFromRouteFunction<F extends RouteFunction> =
  MethodFromRouteOptions<RouteOptionsFromRouteFunction<F>>
export type PathFromRouteFunction<F extends RouteFunction> =
  PathFromRouteOptions<RouteOptionsFromRouteFunction<F>>
export type ResBodyFromRouteFunction<F extends RouteFunction> =
  ResBodyFromRouteOptions<RouteOptionsFromRouteFunction<F>>
export type ReqBodyFromRouteFunction<F extends RouteFunction> =
  ReqBodyFromRouteOptions<RouteOptionsFromRouteFunction<F>>
export type ParamsFromRouteFunction<F extends RouteFunction> =
  ParamsFromRouteOptions<RouteOptionsFromRouteFunction<F>>
export type QueryFromRouteFunction<F extends RouteFunction> =
  QueryFromRouteOptions<RouteOptionsFromRouteFunction<F>>
