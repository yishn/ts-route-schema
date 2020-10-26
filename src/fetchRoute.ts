import * as fetchPonyfill from 'fetch-ponyfill'
import * as qs from 'qs'
import type { RouteSchema } from './RouteSchema'
import type {
  FetchRouteMethodImpl,
  FetchRouteMethodsImpl,
  FetchRouteOptions,
} from './types'

const { fetch, Headers } = fetchPonyfill()

export function fetchRoute<S extends RouteSchema>(
  schema: S,
  options: FetchRouteOptions = {}
): FetchRouteMethodsImpl<S> {
  let result = {} as Record<string, FetchRouteMethodImpl>

  async function request(
    method: string,
    data: Parameters<FetchRouteMethodImpl>[0] = {}
  ) {
    let renderedPath = (options.pathPrefix ?? '') + schema.path

    for (let [name, value] of Object.entries<string>(data.params ?? {})) {
      if (!/^\w+$/.test(name)) {
        throw new Error(
          'Param values may only contain alphanumeric characters'
        )
      }

      let regex = new RegExp(`:${name}`, 'g')
      renderedPath = renderedPath.replace(regex, encodeURIComponent(value))
    }

    if (data.query != null) {
      renderedPath += '?' + qs.stringify(data.query)
    }

    let rawResponse = await fetch(renderedPath, {
      method: method.toUpperCase(),
      headers: new Headers({
        'content-type': 'application/json',
        ...data.headers,
      }),
      body:
        data.req?.body == null && data.body != null
          ? JSON.stringify(data.body)
          : null,
      ...data.req,
    })

    let body = await rawResponse.json().catch(_ => undefined)

    return {
      res: rawResponse,
      status: rawResponse.status,
      get headers() {
        return [...rawResponse.headers.entries()].reduce(
          (acc, [name, value]) => {
            acc[name] = value
            return acc
          },
          {} as Record<string, string>
        )
      },
      body,
    }
  }

  for (let method in schema.methods) {
    if (schema.methods[method] == null) continue

    result[method] = async (data = {}) => {
      return request(method, data)
    }
  }

  return result as any
}
