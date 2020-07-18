import {
  RouteOptions,
  RouteFunction,
  RouteHandler,
  RequestFromRouteOptions,
  ResponseFromRouteOptions,
  TypedParams,
  TypedQuery
} from './types'

export const routeSym = Symbol('routeSym')

export class Route<
  F extends Function = any,
  O extends RouteOptions = RouteOptions
> {
  static wrap<
    F extends Function,
    M extends string,
    Pt extends string,
    Pm extends TypedParams = {},
    R = undefined,
    B = undefined,
    Q extends TypedQuery = {}
  >(
    func: F,
    options: RouteOptions<M, Pt, Pm, R, B, Q>,
    handler: RouteHandler<F, RouteOptions<M, Pt, Pm, R, B, Q>>
  ): F & RouteFunction<F, RouteOptions<M, Pt, Pm, R, B, Q>> {
    let route = new Route(func, options, handler)

    return Object.assign(func, {
      [routeSym]: route
    })
  }

  static fromFunction<F extends Function, O extends RouteOptions>(func: RouteFunction<F, O>): Route<F, O> {
    return func[routeSym]
  }

  private constructor(
    public readonly func: F,
    public readonly options: Readonly<O>,
    public readonly handler: RouteHandler<F, O>
  ) {}

  getMiddleware(): (req: RequestFromRouteOptions<O>, res: ResponseFromRouteOptions<O>) => void {
    return async (req, res) => {
      let result = await this.handler(this.func, req, res)

      if (result !== undefined) {
        res.send(result)
      }
    }
  }
}
