import { RouteSchema, RouteMethods } from './types'

export function RouteSchema<M extends RouteMethods>(
  path: string,
  methods: M
): RouteSchema<M> {
  return {
    path,
    methods,
  }
}
