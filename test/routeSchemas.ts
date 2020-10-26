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
})
