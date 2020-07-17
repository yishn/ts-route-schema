import type {Params, Query} from 'express-serve-static-core'
import type {IncomingHttpHeaders, OutgoingHttpHeaders} from 'http'
import {RouteOptions, RouteFunction, RouteHandler} from './types'

export const routeSym = Symbol('routeSym')

export class Route<
  F extends Function = any,
  M extends string = string,
  Pt extends string = string,
  R = any,
  B = any,
  Pm extends Params = Params,
  Q extends Query = Query
> {
  static wrap<
    F extends Function,
    M extends string,
    Pt extends string,
    R = undefined,
    B = undefined,
    Pm extends Params = {},
    Q extends Query = {}
  >(
    func: F,
    options: RouteOptions<M, Pt, R, B, Pm, Q>,
    handler: RouteHandler<F, RouteOptions<M, Pt, R, B, Pm, Q>>
  ): F & RouteFunction<Route<F, M, Pt, R, B, Pm, Q>> {
    let route = new Route(func, options, handler)

    return Object.assign(func, {
      [routeSym]: route
    })
  }

  private constructor(
    public readonly func: F,
    public readonly options: Readonly<RouteOptions<M, Pt, R, B, Pm, Q>>,
    public readonly handler: RouteHandler<F, RouteOptions<M, Pt, R, B, Pm, Q>>
  ) {}
}
