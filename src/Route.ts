import type { RequestHandler } from 'express'
import type { RouteSchema } from './RouteSchema'
import type { MethodImpls, MethodImpl, MethodSchemas } from './types'

/**
 * @internal
 */
declare const sym: unique symbol

export type Route<S> = [
  path: string,
  handler: RequestHandler & {
    /**
     * @internal
     */
    [sym]?: S
  }
]

/**
 * Defines a route that implements all methods that is defined in the route
 * schema.
 *
 * ### Example
 *
 * ```ts
 * const TestRoute = Route(TestRouteSchema, {
 *  async get(data) {
 *    // Do stuff
 *
 *    return {
 *      body: {
 *        message: `Testing, ${data.query.name}`
 *      }
 *    }
 *  }
 * })
 * ```
 *
 * You can mount the route directly on an Express router with:
 *
 * ```ts
 * const router = express.Router()
 *
 * router.all(...TestRoute)
 * ```
 */
export function Route<S extends RouteSchema>(
  schema: S,
  implementations: S extends RouteSchema<infer M> ? MethodImpls<M> : never
): Route<S> {
  return [
    schema.path,
    async (req, res, next) => {
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

        res.status(responseData.status ?? 200).send(responseData.body)
      } catch (err) {
        res.status(500).send()
      }
    },
  ]
}
