import { NoArgTypeError } from '@/lib/errors'
import { TypeBooleanSchema } from './boolean'
import { TypeSchema, TypeSchemaOptions } from './interface'
import { TypeNumberSchema } from './number'
import { TypeStringSchema } from './string'

export type TypePrimitiveUnionSchemaOptions = TypeSchemaOptions<{
  types: (TypeBooleanSchema | TypeStringSchema | TypeNumberSchema)[]
}>

export class TypePrimitiveUnionSchema implements TypeSchema<unknown> {
  public name = 'primitive-union' as const

  constructor(private options: TypePrimitiveUnionSchemaOptions) {}

  public parse(value: unknown) {
    for (const type of this.options.types) {
      try {
        return type.parse(value)
      } catch {
        continue
      }
    }

    throw new NoArgTypeError(
      `Expected one of ${this.options.types.map((type) => type.constructor.name).join(', ')} but received ${value}`
    )
  }
}
