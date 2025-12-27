import { InternalArgumentSchemaType, InternalOptionSchemaType } from '@/parser'
import { TypeBooleanSchema, TypeNumberSchema, TypeStringSchema } from '@/schema'
import { ProgramArgumentTypes, ProgramOptionTypes } from './create.type'

export function mapToInternalArgumentSchemaType(
  schema: ProgramArgumentTypes
): InternalArgumentSchemaType {
  if (schema === String) {
    return new TypeStringSchema({})
  } else if (schema === Number) {
    return new TypeNumberSchema({})
  } else if (schema === Boolean) {
    return new TypeBooleanSchema({})
  }

  throw new Error(`Not Implemented: ${schema}`)
}

export function mapToInternalOptionSchemaType(
  schema: ProgramOptionTypes
): InternalOptionSchemaType {
  if (schema === String) {
    return new TypeStringSchema({})
  } else if (schema === Number) {
    return new TypeNumberSchema({})
  } else if (schema === Boolean) {
    return new TypeBooleanSchema({})
  }

  throw new Error(`Not Implemented: ${schema}`)
}
