import { NoArgTypeError } from '@/lib/errors'
import { TypeBooleanSchema } from './boolean'
import { TypeSchema, TypeSchemaOptions } from './interface'
import { TypeNumberSchema } from './number'
import { TypeStringSchema } from './string'

export type TypeTupleSchemaOptions = TypeSchemaOptions<{
  schema: (TypeStringSchema | TypeNumberSchema | TypeBooleanSchema)[]
  minLength?: number
  maxLength?: number
}>

export class TypeTupleSchema implements TypeSchema<unknown[]> {
  public name = 'tuple' as const

  constructor(private options: TypeTupleSchemaOptions) {}

  public parse(value: unknown) {
    if (!Array.isArray(value)) {
      throw new NoArgTypeError(`Expected array but received ${value}`)
    }

    return value as unknown[]
  }
}
