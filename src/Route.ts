import type {Params, Query} from 'express-serve-static-core'
import {RouteOptions, RouteFunction, RequestFromRouteOptions, ResponseFromRouteOptions} from './types'

export const routeSym = Symbol('routeSym')

export class Route<
  F extends Function = any,
  M extends string = any,
  Pt extends string = any,
  R = any,
  B = any,
  Pm extends Params = any,
  Q extends Query = any
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
    handler: (
      func: F,
      req: RequestFromRouteOptions<typeof options>,
      res: ResponseFromRouteOptions<typeof options>
    ) => Promise<R | void>
  ): F & RouteFunction<Route<F, M, Pt, R, B, Pm, Q>> {
    let route = new Route(func, options, handler)

    return Object.assign(func, {
      [routeSym]: route
    })
  }

  private constructor(
    public readonly func: F,
    public readonly options: Readonly<RouteOptions<M, Pt, R, B, Pm, Q>>,
    public readonly handler: (
      func: F,
      req: RequestFromRouteOptions<typeof options>,
      res: ResponseFromRouteOptions<typeof options>
    ) => Promise<R | void>
  ) {}
}
