import {
  MethodSchema,
  RequestData,
  ResponseData,
  RouteSchema,
} from '../src/main'

export const TestRouteSchema = RouteSchema('/test', {
  get: MethodSchema<
    RequestData<{}>,
    ResponseData<{
      body: {
        message: string
      }
    }>
  >(),

  post: MethodSchema<
    RequestData<{
      params: {
        blah: string
      }
      body: {
        message: string
      }
    }>,
    ResponseData<{
      contentType: 'application/json'
      status: number
      body: {
        message: string
      }
    }>
  >(),

  patch: MethodSchema<RequestData<{}>, ResponseData<{}>>(),
})

/**
 * Typedoc description
 */
export const ParamsQueryRouteSchema = RouteSchema('/params/:name/query', {
  get: MethodSchema<
    RequestData<{
      params: {
        /**
         * The name
         */
        name: string
      }
      query: {
        /**
         * The query
         *
         * @default 'Default'
         */
        q?: string
      }
    }>,
    ResponseData<{
      body: {
        name: string
        q: string
      }
    }>
  >(),

  delete: MethodSchema<
    RequestData<{
      params: { name: string }
    }>,
    ResponseData<{
      body: {
        name: string
      }
    }>
  >(),
})
