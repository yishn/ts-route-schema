import type { RouteMethods } from './types'

export interface RouteSchema<M extends RouteMethods = any> {
  path: string
  methods: M
}

export function RouteSchema<M extends RouteMethods>(
  path: string,
  methods: M
): RouteSchema<M> {
  return {
    path,
    methods,
  }
}
