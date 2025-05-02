export type Prettify<T extends object> = {
  [Key in keyof T]: T[Key]
} & {}

export type WritableObject<T> = { -readonly [P in keyof T]: T[P] }

export type MergeObject<T, U> = Omit<T, keyof U> & U
export type MergeStrictObject<S, T, U> =
  MergeObject<T, U> extends S ? MergeObject<T, U> & S : never

export type MakeObjectOptional<T> = {
  [Key in keyof T as undefined extends T[Key] ? never : Key]: T[Key]
} & {
  [Key in keyof T as undefined extends T[Key] ? Key : never]?: T[Key]
}
