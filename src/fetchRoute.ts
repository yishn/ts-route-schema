import * as fetchPonyfill from 'fetch-ponyfill'
import * as qs from 'qs'
import {
  FetchRouteMethodImpl,
  FetchRouteMethodsImpl,
  FetchRouteOptions,
  RouteSchema,
} from './types'

const { fetch, Headers } = fetchPonyfill()

export function fetchRoute<S extends RouteSchema>(
  schema: S,
  options: FetchRouteOptions = {}
): FetchRouteMethodsImpl<S> {
  let result = {} as Record<string, FetchRouteMethodImpl>

  for (let method in schema.methods) {
    if (schema.methods[method] == null) continue

    result[method] = async data => {
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

      let body =
        rawResponse.headers.get('content-type') === 'application/json'
          ? await rawResponse.json().catch(_ => undefined)
          : undefined

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
  }

  return result as any
}
