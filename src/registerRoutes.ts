import type {Router, IRouterMatcher} from 'express-serve-static-core'
import {routeSym} from './Route'
import {RouteFunction} from './types'

export function registerRoutes(router: Router, routes: RouteFunction[]) {
  for (let routeFunction of routes) {
    routeFunction[routeSym].register(router)
  }
}
