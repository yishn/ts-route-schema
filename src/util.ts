declare const phantom: unique symbol

export interface Declare<T> {
  [phantom]?: T
}

export type Wrap<T, U> = T & Declare<U>
