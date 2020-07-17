import type {Params, Query, Request, Response} from 'express-serve-static-core'
import {IRouteOptions, IRouteFunction} from './types'

export const routeSym = Symbol('toRoute')

export class Route<
  F extends Function,
  M extends string,
  Pt extends string,
  R,
  B,
  Pm extends Params,
  Q extends Query
> {
  static wrap<
    F extends Function,
    M extends string,
    Pt extends string,
    R,
    B,
    Pm extends Params,
    Q extends Query
  >(
    func: F,
    options: IRouteOptions<M, Pt, R, B, Pm, Q>,
    handler: (func: F, req: Request<Pm, R, B, Q>, res: Response<R>) => Promise<R | void>
  ) {
    (func as unknown as IRouteFunction)[routeSym] = new Route(func, options, handler)
  }

  constructor(
    public readonly func: F,
    public readonly options: IRouteOptions<M, Pt, R, B, Pm, Q>,
    public readonly handler: (func: F, req: Request<Pm, R, B, Q>, res: Response<R>) => Promise<R | void>
  ) {
    this.options = options
  }
}
