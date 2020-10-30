import type { Router } from 'express'
import type { RouteSchema } from './RouteSchema'
import type { MethodImpls, MethodImpl, MethodSchemas } from './types'

/**
 * @internal
 */
declare const phantom: unique symbol

/**
 * Use `Route(schema, implementations)` to create a `Route`.
 */
export interface Route<M extends MethodSchemas> {
  /**
   * @internal
   */
  [phantom]?: M
  /**
   * The route path.
   */
  path: string
  /**
   * Mounts the route to the given Express router.
   *
   * @param router
   */
  mountToExpress(router: Router): void
}

/**
 * Defines a route that implements all methods that is defined in the route
 * schema.
 *
 * #### Example
 *
 * ```ts
 * const TestRoute = Route(TestRouteSchema, {
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
 * You can mount the route directly on an Express router with:
 *
 * ```ts
 * const router = express.Router()
 *
 * TestRoute.mountToExpress(router)
 * ```
 *
 * @param schema - The route schema to implement.
 * @param implementations - The implementations of the methods defined in the
 * given route schema.
 */
export function Route<M extends MethodSchemas>(
  schema: RouteSchema<M>,
  implementations: MethodImpls<M>
): Route<M> {
  return {
    path: schema.path,

    mountToExpress(router) {
      router.all(this.path, async (req, res, next) => {
        let implementation = implementations[
          req.method.toLowerCase() as keyof MethodSchemas
        ] as MethodImpl | undefined

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
