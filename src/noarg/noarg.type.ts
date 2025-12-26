import {
  TypeArraySchema,
  TypeArraySchemaOptions,
  TypeBooleanSchema,
  TypeBooleanSchemaOptions,
  TypeNumberSchema,
  TypeNumberSchemaOptions,
  TypeStringSchema,
  TypeStringSchemaOptions,
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

export type GetInternalOptionSchemaOptions<T extends ProgramUnifiedTypes> =
  T extends StringConstructor
    ? TypeStringSchemaOptions
    : T extends NumberConstructor
      ? TypeNumberSchemaOptions
      : T extends BooleanConstructor
        ? TypeBooleanSchemaOptions
        : T extends ArrayConstructor
          ? TypeArraySchemaOptions
          : never

export type MapInternalArgumentSchemaType<T extends ProgramPrimitiveTypes> =
  T extends StringConstructor
    ? TypeStringSchema
    : T extends NumberConstructor
      ? TypeNumberSchema
      : T extends BooleanConstructor
        ? TypeBooleanSchema
        : never

export type GetInternalArgumentSchemaOptions<T extends ProgramPrimitiveTypes> =
  T extends StringConstructor
    ? TypeStringSchemaOptions
    : T extends NumberConstructor
      ? TypeNumberSchemaOptions
      : T extends BooleanConstructor
        ? TypeBooleanSchemaOptions
        : never
