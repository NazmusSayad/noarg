import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeNumberSchema,
  TypeStringSchema,
} from '@/schema'

export type ProgramPrimitiveTypes =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor

export type ProgramUnifiedTypes = ProgramPrimitiveTypes | ArrayConstructor

export type MapInternalOptionSchemaType<T extends ProgramUnifiedTypes> =
  T extends StringConstructor
    ? TypeStringSchema
    : T extends NumberConstructor
      ? TypeNumberSchema
      : T extends BooleanConstructor
        ? TypeBooleanSchema
        : T extends ArrayConstructor
          ? TypeArraySchema
          : never

export type MapInternalArgumentSchemaType<T extends ProgramPrimitiveTypes> =
  T extends StringConstructor
    ? TypeStringSchema
    : T extends NumberConstructor
      ? TypeNumberSchema
      : T extends BooleanConstructor
        ? TypeBooleanSchema
        : never
