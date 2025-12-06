export interface TypeSchema<T> {
  name: string
  parse(value: unknown): T
}

export type TypeSchemaOptions<T extends Record<string, unknown>> = T & {
  validate?: (value: unknown) => boolean
}
