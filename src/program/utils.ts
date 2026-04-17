import { InternalSchemaType } from '@/parser'
import {
  TypeBooleanSchema,
  TypeEnumSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypePrimitiveUnionSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import { LiteralTypes } from './types.type'

export function mapLiteralToInternalSchema(
  schema: LiteralTypes,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _options?: any
): InternalSchemaType {
  const options = _options ?? {}

  if (schema === null) {
    return new TypeNoValueSchema(options)
  }

  if (schema === String) {
    return new TypeStringSchema(options)
  }

  if (schema === Number) {
    return new TypeNumberSchema(options)
  }

  if (schema === Boolean) {
    return new TypeBooleanSchema(options)
  }

  if (schema === TypePrimitiveUnionSchema) {
    return new TypePrimitiveUnionSchema(options)
  }

  if (
    Array.isArray(schema) &&
    schema.every(
      (item) =>
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean'
    )
  ) {
    return new TypeEnumSchema({ ...options, values: schema })
  }

  if (
    Array.isArray(schema) &&
    schema.every(
      (item) =>
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean'
    )
  ) {
    return new TypeEnumSchema(options)
  }

  if (Array.isArray(schema) && schema.length === 1) {
    const item = schema[0]

    if (
      Array.isArray(item) &&
      item.every(
        (item) => item === String || item === Number || item === Boolean
      )
    ) {
      return new TypeTupleSchema(options)
    }
  }

  throw new Error(`Not Implemented: ${schema}`)
}
