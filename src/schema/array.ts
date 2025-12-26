import { NoArgTypeError } from '@/helpers/errors'
import { TypeBooleanSchema } from './boolean'
import { TypeNumberSchema } from './number'
import { TypeSchema, TypeSchemaOptions } from './schema.interface'
import { TypeStringSchema } from './string'

export type TypeArraySchemaOptions = TypeSchemaOptions<{
  schema: TypeStringSchema | TypeNumberSchema | TypeBooleanSchema
  minLength?: number
  maxLength?: number
}>

export class TypeArraySchema<
  const T extends TypeArraySchemaOptions = TypeArraySchemaOptions,
> implements TypeSchema<unknown[]> {
  public name = 'array' as const

  constructor(private options: T) {}

  public parse(value: unknown) {
    if (!Array.isArray(value)) {
      throw new NoArgTypeError(`Expected array but received ${value}`)
    }

    if (
      this.options.minLength !== undefined &&
      value.length < this.options.minLength
    ) {
      throw new NoArgTypeError(
        `Expected array to be at least ${this.options.minLength} items long`
      )
    }

    if (
      this.options.maxLength !== undefined &&
      value.length > this.options.maxLength
    ) {
      throw new NoArgTypeError(
        `Expected array to be at most ${this.options.maxLength} items long`
      )
    }

    return value.map((item) => this.options.schema.parse(item))
  }
}
