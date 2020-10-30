import type {
  Router as ExpressRouter,
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express'
import type { RouteSchema } from './RouteSchema'
import type { MethodImpls, MethodSchemas } from './types'

/**
 * @internal
 */
declare const phantom: unique symbol

/**
 * Use one of the `RouteImpl` functions to create a `RouteImpl` instance.
 */
export interface RouteImpl<M extends MethodSchemas, R> {
  /**
   * @internal
   */
  [phantom]?: M
  /**
   * The route path.
   */
  path: string
  /**
   * Mounts the route onto the server library.
   *
   * @param router
   */
  mountOnto(router: R): void
}

/**
 * Creates a `RouteImpl` instance that contains implementations of all methods
 * of a route schema that can be mounted onto an Express router.
 *
 * #### Example
 *
 * ```ts
 * const TestRoute = ExpressRouteImpl(TestRouteSchema, {
 *   async get(data) {
 *     // Do stuff
 *
 *     return {
 *       body: {
 *         message: `Testing, ${data.query.name}`
 *       }
 *     }
 *   }
 * })
 * ```
 *
 * You can mount the route directly onto an Express router with:
 *
 * ```ts
 * const router = express.Router()
 *
 * TestRoute.mountOnto(router)
 * ```
 *
 * @param schema - The route schema to implement.
 * @param implementations - The implementations of the methods defined in the
 * given route schema.
 */
export function ExpressRouteImpl<M extends MethodSchemas>(
  schema: RouteSchema<M>,
  implementations: MethodImpls<M, ExpressRequest, ExpressResponse>
): RouteImpl<M, ExpressRouter> {
  return {
    path: schema.path,

    mountOnto(router) {
      router.all(this.path, async (req, res, next) => {
        let implementation =
          implementations[req.method.toLowerCase() as keyof MethodSchemas]
        if (implementation == null) return next()

        try {
          let responseData = await implementation({
            req,
            res,
            contentType: req.header('content-type'),
            params: req.params,
            query: req.query,
            body: req.body,
          })

          res
            .header(
              'content-type',
              responseData.contentType ?? 'application/json'
            )
            .status(responseData.status ?? 200)
            .send(responseData.body)
        } catch (err) {
          res.status(500).send()
        }
      })
    },
  }
}
