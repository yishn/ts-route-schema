import type {Request, Response, Params, Query} from 'express-serve-static-core'
import type {Route, routeSym} from './Route'
import type {Declare} from './util'

export interface RouteOptions<
  M extends string = string,
  Pt extends string = string,
  Pm extends Params = Params,
  R = any,
  B = any,
  Q extends Query = Query
> {
  method: M,
  path: Pt,
  responseBody?: Declare<R>,
  requestBody?: Declare<B>,
  params?: Declare<Pm>,
  query?: Declare<Q>
}

export interface RouteFunction<F extends Function = any, O extends RouteOptions = RouteOptions> {
  [routeSym]: Route<F, O>
}

export type MethodFromRouteOptions<O> =
  O extends RouteOptions<infer M> ? M : never
export type PathFromRouteOptions<O> =
  O extends RouteOptions<any, infer Pt> ? Pt : never
export type ParamsFromRouteOptions<O> =
  O extends RouteOptions<any, any, infer Pm> ? Pm : never
export type ResBodyFromRouteOptions<O> =
  O extends RouteOptions<any, any, any, infer R> ? R : never
export type ReqBodyFromRouteOptions<O> =
  O extends RouteOptions<any, any, any, any, infer B> ? B : never
export type QueryFromRouteOptions<O> =
  O extends RouteOptions<any, any, any, any, any, infer Q> ? Q : never

export type RequestFromRouteOptions<O> = Request<
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
