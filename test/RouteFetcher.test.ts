import * as t from 'tap'
import * as express from 'express'
import * as getPort from 'get-port'
import { ParamsQueryRoute, TestRoute } from './routes'
import { RouteFetcher } from '../src/main'
import { ParamsQueryRouteSchema, TestRouteSchema } from './routeSchemas'

t.test('RouteFetcher', async t => {
  t.beforeEach(async (_, t) => {
    const port = await getPort()
    const app = express()

    app.use(express.json())

    TestRoute.mountToExpress(app)
    ParamsQueryRoute.mountToExpress(app)

    t.context.pathPrefix = `http://localhost:${port}`

    await new Promise(resolve => {
      t.context.server = app.listen(port, resolve)
    })
  })

  t.afterEach(async (_, t) => {
    t.context.server.close()
  })

  t.test('Fire a GET request', async t => {
    let response = await RouteFetcher(TestRouteSchema, {
      pathPrefix: t.context.pathPrefix,
    }).get()

    t.strictEqual(response.status, 200)
    if (response.status === 200) {
      t.strictEqual(response.body.message, 'Hello World!')
    }
  })

  t.test('Fire a POST request', async t => {
    let response = await RouteFetcher(TestRouteSchema, {
      pathPrefix: t.context.pathPrefix,
    }).post({
      params: {
        blah: 'hi',
      },
      body: {
        message: 'Hi everyone!',
      },
    })

    t.strictEqual(response.status, 201)
    if (response.status === 201) {
      t.strictEqual(response.body.message, 'Hi everyone!')
    }
  })

  t.test('Fire a PATCH request with uncaught server error', async t => {
    let response = await RouteFetcher(TestRouteSchema, {
      pathPrefix: t.context.pathPrefix,
    }).patch()

    t.strictEqual(response.status, 500)
    t.strictEqual(response.body, undefined)
  })

  t.test('Fire a GET request with params and query', async t => {
    let response = await RouteFetcher(ParamsQueryRouteSchema, {
      pathPrefix: t.context.pathPrefix,
    }).get({
      params: { name: '沈易川' },
      query: { q: 'stuck in traffic' },
    })

    t.strictEqual(response.status, 200)
    if (response.status === 200) {
      t.strictEqual(response.body.name, '沈易川')
      t.strictEqual(response.body.q, 'stuck in traffic')
    }
  })

  t.test('Fire a DELETE request with params and query', async t => {
    let response = await RouteFetcher(ParamsQueryRouteSchema, {
      pathPrefix: t.context.pathPrefix,
    }).delete({
      params: { name: '沈易川' },
    })

    t.strictEqual(response.status, 200)
    if (response.status === 200) {
      t.strictEqual(response.body.name, '沈易川')
    }
  })
})
