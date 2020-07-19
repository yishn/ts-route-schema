import type {Request, Params, Query} from 'express-serve-static-core'
import type {ContentType} from './types'

declare const phantom: unique symbol

export interface Declare<T> {
  [phantom]?: T
}

export type Wrap<T, U> = T & Declare<U>

export function isContentType<Pm extends Params, R, B, Q extends Query, C extends string>(
  req: Request<Pm, R, B, Q>,
  body: B,
  contentType: C
): body is Extract<B, ContentType<C>> {
  return req.get('Content-Type') === contentType
}
