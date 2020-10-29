import type { MethodSchemas } from './types'

export interface RouteSchema<M extends MethodSchemas = any> {
  path: string
  methods: M
}

export function RouteSchema<M extends MethodSchemas>(
  path: string,
  methods: M
): RouteSchema<M> {
  return {
    path,
    methods,
  }
}
