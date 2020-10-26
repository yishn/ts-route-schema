import * as t from 'tap'
import * as express from 'express'
import { TestRoute } from './routes'
import { fetchRoute } from '../src/main'
import { TestRouteSchema } from './routeSchemas'

const app = express()
const pathPrefix = 'http://localhost:3000'

app.use(express.json())
app.use(...TestRoute)

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
})
