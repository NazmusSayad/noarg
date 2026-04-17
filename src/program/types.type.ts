import {
  TypeArraySchema,
  TypeArraySchemaOptions,
  TypeBooleanSchema,
  TypeBooleanSchemaOptions,
  TypeEnumSchema,
  TypeEnumSchemaOptions,
  TypeNoValueSchema,
  TypeNoValueSchemaOptions,
  TypeNumberSchema,
  TypeNumberSchemaOptions,
  TypePrimitiveUnionSchema,
  TypePrimitiveUnionSchemaOptions,
  TypeStringSchema,
  TypeStringSchemaOptions,
  TypeTupleSchema,
  TypeTupleSchemaOptions,
} from '@/schema'

export type LiteralNoValueType = null

export type LiteralStringType = StringConstructor
export type LiteralNumberType = NumberConstructor
export type LiteralBooleanType = BooleanConstructor
export type LiteralEnumType = (string | number | boolean)[]
export type LiteralPrimitiveUnionType = typeof TypePrimitiveUnionSchema

export type LiteralArrayType = (
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
)[]
export type LiteralTupleType = [
  (StringConstructor | NumberConstructor | BooleanConstructor)[],
]

export type LiteralTypes =
  | LiteralNoValueType
  | LiteralStringType
  | LiteralNumberType
  | LiteralBooleanType
  | LiteralEnumType
  | LiteralPrimitiveUnionType
  | LiteralArrayType
  | LiteralTupleType

export type MapLiteralInternalSchemaType<T extends LiteralTypes, TOptions> =
  // No Value
  T extends LiteralNoValueType
    ? TypeNoValueSchema<
        TOptions extends TypeNoValueSchemaOptions ? TOptions : never
      >
    : // Primitive Types
      T extends LiteralStringType
      ? TypeStringSchema<
          TOptions extends TypeStringSchemaOptions ? TOptions : never
        >
      : T extends LiteralNumberType
        ? TypeNumberSchema<
            TOptions extends TypeNumberSchemaOptions ? TOptions : never
          >
        : T extends LiteralBooleanType
          ? TypeBooleanSchema<
              TOptions extends TypeBooleanSchemaOptions ? TOptions : never
            >
          : // Enum
            T extends LiteralEnumType
            ? TypeEnumSchema<
                TOptions extends TypeEnumSchemaOptions ? TOptions : never
              >
            : // Array
              T extends LiteralArrayType
              ? TypeArraySchema<
                  TOptions extends TypeArraySchemaOptions ? TOptions : never
                >
              : // Tuple
                T extends LiteralTupleType
                ? TypeTupleSchema<
                    TOptions extends TypeTupleSchemaOptions ? TOptions : never
                  >
                : never

export type GetLiteralToInternalSchemaOptions<T extends LiteralTypes> =
  // No Value
  T extends LiteralNoValueType
    ? TypeNoValueSchemaOptions
    : // String
      T extends LiteralStringType
      ? TypeStringSchemaOptions
      : // Number
        T extends LiteralNumberType
        ? TypeNumberSchemaOptions
        : // Boolean
          T extends LiteralBooleanType
          ? TypeBooleanSchemaOptions
          : // Enum
            T extends LiteralEnumType
            ? Omit<TypeEnumSchemaOptions, 'values'>
            : // Primitive Union
              T extends LiteralPrimitiveUnionType
              ? TypePrimitiveUnionSchemaOptions
              : // Array
                T extends LiteralArrayType
                ? TypeArraySchemaOptions
                : // Tuple
                  T extends LiteralTupleType
                  ? TypeTupleSchemaOptions
                  : never
