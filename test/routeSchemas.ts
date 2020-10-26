import { as, RequestData, ResponseData, RouteSchema } from '../src/main'

export const TestRouteSchema = RouteSchema('/test', {
  get: as<
    [
      RequestData<{}>,
      ResponseData<{
        body: {
          message: string
        }
      }>
    ]
  >(),

  post: as<
    [
      RequestData<{
        params: {
          blah: string
        }
        body: {
          message: string
        }
      }>,
      ResponseData<{
        status: number
        body: {
          message: string
        }
      }>
    ]
  >(),

  patch: as<[RequestData<{}>, ResponseData<{}>]>(),
})

export const ParamsQueryRouteSchema = RouteSchema('/params/:name/query', {
  get: as<
    [
      RequestData<{
        params: { name: string }
        query: { q: string }
      }>,
      ResponseData<{
        body: {
          name: string
          q: string
        }
      }>
    ]
  >(),

  delete: as<
    [
      RequestData<{
        params: { name: string }
      }>,
      ResponseData<{
        body: {
          name: string
        }
      }>
    ]
  >(),
})
