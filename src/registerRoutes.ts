import type {Router, IRouterMatcher} from 'express-serve-static-core'
import {routeSym} from './Route'
import {RouteFunction} from './types'

export function registerRoutes(router: Router, routes: RouteFunction[]) {
  for (let routeFunction of routes) {
    let route = routeFunction[routeSym]
    let method = route.options.method.toLowerCase() as keyof Router

    ;(router[method] as IRouterMatcher<typeof router>)(route.options.path, async (req, res) => {
      let result = await route.handler(route.func, req, res)

      if (result !== undefined) {
        res.send(result)
      }
    })
  }
}
