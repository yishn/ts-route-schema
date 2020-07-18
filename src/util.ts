declare const phantom: unique symbol

export interface Declare<T> {
  [phantom]: T
}

export function declare<T>(): Declare<T> {
  return undefined as unknown as Declare<T>
}
