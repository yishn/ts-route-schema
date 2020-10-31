# ts-route-schema

[![CI](https://github.com/yishn/ts-route-schema/workflows/CI/badge.svg?event=push)](https://github.com/yishn/ts-route-schema/actions)
[![GitHub Repository](https://img.shields.io/badge/-GitHub-%23181717?logo=GitHub)](https://github.com/yishn/ts-route-schema)
[![Typedoc](https://img.shields.io/badge/-Typedoc-blue?logo=TypeScript)](https://yishn.github.io/ts-route-schema)

Strictly typed, isomorphic routes.

## Introduction

Current Node.js server libraries and web frameworks are not very type safe. The
type systems are hard to use and also easy to misuse. Furthermore, they are
often not coupled with frontend code at all, making it easy for frontend code to
make incorrect requests to the backend server that could have been avoided by
the type compiler in the first place.

This library helps you write isomorphic code, so your backend routes and
frontend HTTP requests can stay in sync. We currently only support the
[Express](https://expressjs.com) framework.

## Getting Started

We assume you have an isomorphic TypeScript project set up. For best experience,
operate in `strict` mode. Install this library using npm:

```
$ npm install ts-route-schema
```

### Defining Route Schemas

First, we have to define route schemas. These are objects that describes all the
HTTP methods and route type information that should be made available to both
backend and frontend code:

```ts
// shared/routeSchemas.ts

import {
  RouteSchema,
  MethodSchema,
  RequestData,
  ResponseData,
} from 'ts-route-schema'

/**
 * Creates a greeting for the given name.
 */
export const HelloRouteSchema = RouteSchema('/hello/:name', {
  get: MethodSchema<
    RequestData<{
      params: {
        /**
         * The name of the person to be greeted.
         */
        name: string
      }
      query: {
        /**
         * The greeting to use.
         *
         * @default 'Hello World'
         */
        greeting?: string
      }
    }>,
    ResponseData<{
      body: {
        /**
         * The requested greeting.
         */
        message: string
      }
    }>
  >(),
})
```

### Implementing Routes

On the backend, you can implement routes based on the previously defined route
schema:

```ts
// backend/routes.ts

import { ExpressRouteImpl } from 'ts-route-schema'
import { HelloRouteSchema } from '../shared/routeSchemas'

export const HelloRoute = ExpressRouteImpl(HelloRouteSchema, {
  async get(data) {
    let greeting = data.query.greeting ?? 'Hello World'
    let message = `${greeting}, ${data.params.name}`

    return {
      body: {
        message,
      },
    }
  },
})
```

You can easily mount your route implementation on your Express router:

```ts
// backend/main.ts

import * as express from 'express'
import { HelloRoute } from './routes'

const app = express()

app.use(express.json())
HelloRoute.mountOn(app)

app.listen(3000)
```

### Requesting Routes

You can request the route from the frontend as follows:

```ts
// frontend/fetchGreeting.ts

import { RouteFetcher } from 'ts-route-schema'
import { HelloRouteSchema } from '../shared/routeSchemas'

export async function fetchGreeting(
  name: string,
  greeting: string
): Promise<string> {
  let response = await RouteFetcher(HelloRouteSchema).get({
    params: { name },
    query: { greeting },
  })

  // Equivalent to:
  //
  // await fetch(
  //   `/hello/${encodeURIComponent(name)}?greeting=${encodeURIComponent(
  //     greeting
  //   )}`
  // )

  if (response.status !== 200) {
    throw new Error('Failed to get greeting')
  }

  return response.body.message
}
```

We're using [fetch-ponyfill](https://www.npmjs.com/package/fetch-ponyfill) which
is an isomorphic library, i.e. `RouteFetcher` also works on the backend. On the
backend, you might want to set the `pathPrefix` option.

## Building & Testing

To run the tests, execute as usual:

```
$ npm test
```

To build the project, use the `build` npm script:

```
$ npm run build
```

Make sure you have formatted all files using Prettier beforehand:

```
$ npm run format
```

To build the documentation, execute:

```
$ npm run docs
```
