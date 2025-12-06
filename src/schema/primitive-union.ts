import { NoArgTypeError } from '@/lib/errors'
import { TypeBooleanSchema } from './boolean'
import { TypeSchema } from './interface'
import { TypeNoValueSchema } from './no-value'
import { TypeNumberSchema } from './number'
import { TypeStringSchema } from './string'

export class TypePrimitiveUnionSchema implements TypeSchema<unknown> {
  constructor(
    public types: (
      | TypeNoValueSchema
      | TypeBooleanSchema
      | TypeStringSchema
      | TypeNumberSchema
    )[]
  ) {}

  public parse(value: unknown): unknown {
    for (const type of this.types) {
      try {
        return type.parse(value)
      } catch {
        continue
      }
    }

    throw new NoArgTypeError(
      `Expected one of ${this.types.map((type) => type.constructor.name).join(', ')} but received ${value}`
    )
  }
}
