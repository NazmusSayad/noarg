import { NoArgTypeError } from '@/lib/errors'
import { TypeBooleanSchema } from './boolean'
import { TypeSchema, TypeSchemaOptions } from './interface'
import { TypeNumberSchema } from './number'
import { TypeStringSchema } from './string'

export type TypeArraySchemaOptions = TypeSchemaOptions<{
  schema: TypeStringSchema | TypeNumberSchema | TypeBooleanSchema
  minLength?: number
  maxLength?: number
}>

export class TypeArraySchema implements TypeSchema<unknown[]> {
  public name = 'array' as const

  constructor(private options: TypeArraySchemaOptions) {}

  public parse(value: unknown) {
    if (!Array.isArray(value)) {
      throw new NoArgTypeError(`Expected array but received ${value}`)
    }

    return value.map((item) => this.options.schema.parse(item))
  }
}
