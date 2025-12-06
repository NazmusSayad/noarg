import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeBooleanSchemaOptions = TypeSchemaOptions<{}>

export class TypeBooleanSchema implements TypeSchema<boolean> {
  public name = 'boolean' as const

  constructor(private options: TypeBooleanSchemaOptions) {}

  public parse(value: unknown): boolean {
    if (value === 'true' || value === 'yes' || value === true) {
      return true
    }

    if (value === 'false' || value === 'no' || value === false) {
      return false
    }

    throw new NoArgTypeError(`Expected boolean but received ${value}`)
  }
}
