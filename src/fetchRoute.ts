import * as fetchPonyfill from 'fetch-ponyfill'
import * as qs from 'qs'
import type { RouteSchema } from './RouteSchema'
import type { MethodFetch, MethodFetchs, FetchRouteOptions } from './types'

const { fetch } = fetchPonyfill()

export function fetchRoute<S extends RouteSchema>(
  schema: S,
  options: FetchRouteOptions = {}
): MethodFetchs<S extends RouteSchema<infer M> ? M : never> {
  let result = {} as Record<string, MethodFetch>

  async function request(
    method: string,
    data: Parameters<MethodFetch>[0] = {}
  ) {
    let renderedPath = (options.pathPrefix ?? '') + schema.path

    for (let name in data.params ?? {}) {
      let value = (data.params?.[name] as string) ?? ''

      if (!/^\w+$/.test(name)) {
        throw new Error('Param values may only contain alphanumeric characters')
      }

      let regex = new RegExp(`:${name}\\??`, 'g')
      renderedPath = renderedPath.replace(regex, encodeURIComponent(value))
    }

    if (data.query != null) {
      renderedPath += '?' + qs.stringify(data.query)
    }

    let rawResponse = await fetch(renderedPath, {
      method: method.toUpperCase(),
      headers: {
        'content-type': 'application/json',
        ...data.headers,
      },
      body:
        data.req?.body == null && data.body != null
          ? JSON.stringify(data.body)
          : null,
      ...data.req,
    })

    let body = await rawResponse.json().catch(_ => undefined)
    let headers: Record<string, string> | undefined

    return {
      res: rawResponse,
      status: rawResponse.status,
      get headers() {
        if (headers == null) {
          headers = [...rawResponse.headers.entries()].reduce(
            (acc, [name, value]) => {
              acc[name] = value
              return acc
            },
            {} as Record<string, string>
          )
        }

        return headers
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
