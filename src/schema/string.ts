import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaBase } from './base'

export type TypeStringSchemaOptions = {
  minLength?: number
  maxLength?: number
}

export class TypeStringSchema
  extends TypeSchemaBase
  implements TypeSchema<string>
{
  constructor(protected options: TypeStringSchemaOptions) {
    super()
  }

  public validate(value: unknown): string {
    if (typeof value !== 'string') {
      throw new NoArgTypeError(`Expected string but received ${value}`)
    }

    return value
  }
}
