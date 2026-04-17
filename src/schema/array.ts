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
    const resolvedValue = (Array.isArray(value) ? value : [value]) as (
      | string
      | number
      | boolean
    )[]

    if (
      this.options.minLength !== undefined &&
      resolvedValue.length < this.options.minLength
    ) {
      throw new NoArgTypeError(
        `Expected array to be at least ${this.options.minLength} items long`
      )
    }

    if (
      this.options.maxLength !== undefined &&
      resolvedValue.length > this.options.maxLength
    ) {
      throw new NoArgTypeError(
        `Expected array to be at most ${this.options.maxLength} items long`
      )
    }

    return resolvedValue.map((item) => this.options.schema.parse(item))
  }
}
