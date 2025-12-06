export interface TypeSchema<T> {
  parse(value: unknown): T
}
