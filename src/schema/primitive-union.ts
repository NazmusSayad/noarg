import { TypeSchemaBase } from './base'
import { TypeBooleanSchema } from './boolean'
import { TypeNoValueSchema } from './no-value'
import { TypeNumberSchema } from './number'
import { TypeStringSchema } from './string'

export class PrimitiveUnionSchema extends TypeSchemaBase {
  constructor(
    public types: (
      | TypeNoValueSchema
      | TypeBooleanSchema
      | TypeStringSchema
      | TypeNumberSchema
    )[]
  ) {
    super()
  }
}
