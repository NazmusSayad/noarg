export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type NormalizeNullableArray<T> = T extends readonly unknown[] ? T : []

export type ConcatNullableArray<
  A extends readonly unknown[] | undefined,
  B extends readonly unknown[] | undefined,
> = [...NormalizeNullableArray<A>, ...NormalizeNullableArray<B>]

export type MergeTwoObjects<Base, T> = Omit<Base, keyof T> & T
