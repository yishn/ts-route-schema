declare const declareSym: unique symbol

export interface Declare<T> {
  [declareSym]: T
}

export function declare<T>(): Declare<T> {
  return undefined as unknown as Declare<T>
}
