import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeArraySchemaOptions = TypeSchemaOptions<{
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

    return value as unknown[]
  }
}
