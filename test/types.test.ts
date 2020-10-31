import { expectType, TypeEqual } from 'ts-expect'
import * as t from 'tap'
import { RequestData, ResponseData } from '../src/main'

t.test('types', async t => {
  t.test('RequestData', async t => {
    expectType<
      TypeEqual<
        RequestData<{}>,
        {
          contentType?: 'application/json'
          params?: {}
          query?: {}
          body?: undefined
        }
      >
    >(true)

    expectType<
      TypeEqual<
        RequestData<{
          params: {
            param: string
          }
          body: {
            blah: string
          }
        }>,
        {
          contentType?: 'application/json'
          params: {
            param: string
          }
          query?: {}
          body: {
            blah: string
          }
        }
      >
    >(true)
  })

  t.test('ResponseData', async t => {
    expectType<
      TypeEqual<
        ResponseData<{}>,
        {
          contentType?: 'application/json'
          status?: 200
          body?: undefined
        }
      >
    >(true)

    expectType<
      TypeEqual<
        ResponseData<{
          status: 200
          body: {
            blah: string
          }
        }>,
        {
          contentType?: 'application/json'
          status?: 200
          body: {
            blah: string
          }
        }
      >
    >(true)
  })
})
