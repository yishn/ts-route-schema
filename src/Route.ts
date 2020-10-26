import type { RequestHandler } from 'express'
import type { RouteSchema } from './RouteSchema'
import type { RouteMethodsImpl, RouteMethodImpl } from './types'

export function Route<S extends RouteSchema>(
  schema: S,
  implementations: RouteMethodsImpl<S>
): [string, RequestHandler] {
  return [
    schema.path,
    async (req, res, next) => {
      let implementation = implementations[
        req.method.toLowerCase() as keyof RouteMethodsImpl<S>
      ] as RouteMethodImpl | undefined

      if (implementation == null) return next()

      try {
        let responseData = await implementation({
          req,
          res,
          headers: req.headers,
          params: req.params,
          query: req.query,
          body: req.body,
        })

        for (let name in responseData.headers ?? {}) {
          let value = responseData.headers?.[name] as string | string[]
          res.header(name, value)
        }

        res.status(responseData.status ?? 200).send(responseData.body)
      } catch (err) {
        res.status(500).send()
      }
    },
  ]
}
