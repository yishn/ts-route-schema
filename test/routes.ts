import { Route } from '../src/main'
import { TestRouteSchema } from './routeSchemas'

export const TestRoute = Route(TestRouteSchema, {
  async get(data) {
    return {
      body: {
        message: 'Hello World!',
      },
    }
  },

  async post(data) {
    return {
      status: 201,
      body: {
        message: data.body.message,
      },
    }
  },
})
