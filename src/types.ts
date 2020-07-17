import type * as ExpressTypes from 'express-serve-static-core'
import type {Route, routeSym} from './Route'
import type {Declare} from './util'

export interface IRouteFunction extends Function {
  [routeSym]: Route<any, any, any, any, any, any, any>
}

export interface IRouteOptions<
  M extends string,
  Pt extends string,
  R,
  B,
  Pm extends ExpressTypes.Params,
  Q extends ExpressTypes.Query
> {
  method: M,
  path: Pt,
  responseBody?: Declare<R>,
  requestBody?: Declare<B>,
  params?: Declare<Pm>,
  query?: Declare<Q>
}
