import { NoArgTypeError } from '@/helpers/errors'
import { TypeBooleanSchema } from './boolean'
import { TypeSchema, TypeSchemaOptions } from './interface'
import { TypeNumberSchema } from './number'
import { TypeStringSchema } from './string'

export type TypeTupleSchemaOptions = TypeSchemaOptions<{
  schema: (TypeStringSchema | TypeNumberSchema | TypeBooleanSchema)[]
}>

export class TypeTupleSchema<
  const T extends TypeTupleSchemaOptions = TypeTupleSchemaOptions,
> implements TypeSchema<unknown[]> {
  public name = 'tuple' as const

  constructor(private options: T) {}

  public parse(value: unknown) {
    if (!Array.isArray(value)) {
      throw new NoArgTypeError(`Expected array but received ${value}`)
    }

    if (value.length !== this.options.schema.length) {
      throw new NoArgTypeError(
        `Expected tuple of length ${this.options.schema.length} but received ${value.length}`
      )
    }

    return this.options.schema.map((schema, index) =>
      schema.parse(value[index])
    )
  }
}
