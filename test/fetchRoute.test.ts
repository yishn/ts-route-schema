import * as t from 'tap'
import * as express from 'express'
import { ParamsQueryRoute, TestRoute } from './routes'
import { fetchRoute } from '../src/main'
import { ParamsQueryRouteSchema, TestRouteSchema } from './routeSchemas'

const app = express()
const pathPrefix = 'http://localhost:3000'

app.use(express.json())
app.all(...TestRoute)
app.all(...ParamsQueryRoute)

t.test('fetchRoute', async t => {
  t.beforeEach(async (_, t) => {
    await new Promise(resolve => {
      t.context.server = app.listen(3000, resolve)
    })
  })

  t.afterEach(async (_, t) => {
    t.context.server.close()
  })

  t.test('Fire a GET request', async t => {
    let response = await fetchRoute(TestRouteSchema, { pathPrefix }).get()

    t.strictEqual(response.status, 200)
    t.strictEqual(response.body?.message, 'Hello World!')
  })

  t.test('Fire a POST request', async t => {
    let response = await fetchRoute(TestRouteSchema, { pathPrefix }).post({
      params: {
        blah: 'hi',
      },
      body: {
        message: 'Hi everyone!',
      },
    })

    t.strictEqual(response.status, 201)
    t.strictEqual(response.body?.message, 'Hi everyone!')
  })

  t.test('Fire a PATCH request with uncaught server error', async t => {
    let response = await fetchRoute(TestRouteSchema, { pathPrefix }).patch()

    t.strictEqual(response.status, 500)
    t.strictEqual(response.body, undefined)
  })

  t.test('Fire a GET request with params and query', async t => {
    let response = await fetchRoute(ParamsQueryRouteSchema, { pathPrefix }).get(
      {
        params: { name: '沈易川' },
        query: { q: 'stuck in traffic' },
      }
    )

    t.strictEqual(response.status, 200)
    t.strictEqual(typeof response.headers, 'object')
    t.strictEqual(response.body?.name, '沈易川')
    t.strictEqual(response.body?.q, 'stuck in traffic')
  })

  t.test('Fire a DELETE request with params and query', async t => {
    let response = await fetchRoute(ParamsQueryRouteSchema, {
      pathPrefix,
    }).delete({
      params: { name: '沈易川' },
    })

    t.strictEqual(response.status, 200)
    t.strictEqual(response.body?.name, '沈易川')
  })
})
