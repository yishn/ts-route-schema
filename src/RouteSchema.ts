import type { MethodSchemas } from './types'

/**
 * Use `RouteSchema(path, methods)` to declare this interface.
 */
export interface RouteSchema<M extends MethodSchemas = any> {
  /**
   * The path of the route.
   */
  path: string
  /**
   * Defines supported HTTP methods on the given path and type information on
   * request and response data.
   */
  methods: M
}

/**
 * Defines a route schema, i.e. a path on the server with type information on
 * request data and response data for every supported HTTP methods.
 *
 * #### Example
 *
 * ```ts
 * const TestRouteSchema = RouteSchema('/test', {
 *   get: MethodSchema<
 *     RequestData<{
 *       query: { name: string }
 *     }>,
 *     ResponseData<{
 *       body: { message: string }
 *     }>
 *   >()
 * })
 * ```
 *
 * @param path - The path of the route.
 * @param methods - Defines supported HTTP methods on the given path and type
 * information on request and response data.
 */
export function RouteSchema<M extends MethodSchemas>(
  path: string,
  methods: M
): RouteSchema<M> {
  return {
    path,
    methods,
  }
}
