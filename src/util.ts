export interface Declare<T> {}

export function declare<T>(): Declare<T> {
  return undefined as any as Declare<T>
}
