import type {RequestHandler, Params, Query} from 'express-serve-static-core'
import {RouteOptions, RouteFunction, RouteHandler} from './types'

export const routeSym = Symbol('routeSym')

export class Route<
  F extends Function = any,
  M extends string = string,
  Pt extends string = string,
  Pm extends Params = Params,
  R = any,
  B = any,
  Q extends Query = Query
> {
  static wrap<
    F extends Function,
    M extends string,
    Pt extends string,
    Pm extends Params = {},
    R = undefined,
    B = undefined,
    Q extends Query = {}
  >(
    func: F,
    options: RouteOptions<M, Pt, Pm, R, B, Q>,
    handler: RouteHandler<F, RouteOptions<M, Pt, Pm, R, B, Q>>
  ): F & RouteFunction<Route<F, M, Pt, Pm, R, B, Q>> {
    let route = new Route(func, options, handler)

    return Object.assign(func, {
      [routeSym]: route
    })
  }

  private constructor(
    public readonly func: F,
    public readonly options: Readonly<RouteOptions<M, Pt, Pm, R, B, Q>>,
    public readonly handler: RouteHandler<F, RouteOptions<M, Pt, Pm, R, B, Q>>
  ) {}

  getMiddleware(): RequestHandler {
    return async (req, res) => {
      let result = await this.handler(this.func, req as any, res)

      if (result !== undefined) {
        res.send(result)
      }
    }
  }
}
