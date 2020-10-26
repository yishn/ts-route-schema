import { RouteSchema, RouteSchemaMethods } from './types'

export function RouteSchema<M extends RouteSchemaMethods>(
  path: string,
  methods: M
): RouteSchema<M> {
  return {
    path,
    methods,
  }
}
