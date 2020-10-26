import { as, RequestData, ResponseData, RouteSchema } from '../src/main'

export const TestRouteSchema = RouteSchema('/test', {
  get(data: RequestData<{}>) {
    return as<
      ResponseData<{
        body: {
          message: string
        }
      }>
    >()
  },

  post(
    data: RequestData<{
      params: {
        blah: string
      }
      body: {
        message: string
      }
    }>
  ) {
    return as<
      ResponseData<{
        status: number
        body: {
          message: string
        }
      }>
    >()
  },

  patch(data: RequestData<{}>) {
    return as<ResponseData<{}>>()
  },
})

export const ParamsQueryRouteSchema = RouteSchema('/params/:name/query', {
  get(
    data: RequestData<{
      params: { name: string }
      query: { q: string }
    }>
  ) {
    return as<
      ResponseData<{
        body: {
          name: string
          q: string
        }
      }>
    >()
  },

  delete(
    data: RequestData<{
      params: { name: string }
    }>
  ) {
    return as<
      ResponseData<{
        body: {
          name: string
        }
      }>
    >()
  },
})
