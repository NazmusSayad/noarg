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

type ProgramPrimitiveTypes =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor

export type ProgramArgumentTypes = ProgramPrimitiveTypes
export type ProgramOptionTypes = ProgramPrimitiveTypes | ArrayConstructor

export type MapInternalOptionSchemaType<
  T extends ProgramOptionTypes,
  TOptions extends
    | TypeStringSchemaOptions
    | TypeNumberSchemaOptions
    | TypeBooleanSchemaOptions
    | TypeArraySchemaOptions,
> = T extends StringConstructor
  ? TypeStringSchema<
      TOptions extends TypeStringSchemaOptions ? TOptions : never
    >
  : T extends NumberConstructor
    ? TypeNumberSchema<
        TOptions extends TypeNumberSchemaOptions ? TOptions : never
      >
    : T extends BooleanConstructor
      ? TypeBooleanSchema<
          TOptions extends TypeBooleanSchemaOptions ? TOptions : never
        >
      : T extends ArrayConstructor
        ? TypeArraySchema<
            TOptions extends TypeArraySchemaOptions ? TOptions : never
          >
        : never

export type GetInternalOptionSchemaOptions<T extends ProgramOptionTypes> =
  T extends StringConstructor
    ? TypeStringSchemaOptions
    : T extends NumberConstructor
      ? TypeNumberSchemaOptions
      : T extends BooleanConstructor
        ? TypeBooleanSchemaOptions
        : T extends ArrayConstructor
          ? TypeArraySchemaOptions
          : {}

export type MapInternalArgumentSchemaType<
  T extends ProgramPrimitiveTypes,
  TOptions extends
    | TypeStringSchemaOptions
    | TypeNumberSchemaOptions
    | TypeBooleanSchemaOptions,
> = T extends StringConstructor
  ? TypeStringSchema<
      TOptions extends TypeStringSchemaOptions ? TOptions : never
    >
  : T extends NumberConstructor
    ? TypeNumberSchema<
        TOptions extends TypeNumberSchemaOptions ? TOptions : never
      >
    : T extends BooleanConstructor
      ? TypeBooleanSchema<
          TOptions extends TypeBooleanSchemaOptions ? TOptions : never
        >
      : never

export type GetInternalArgumentSchemaOptions<T extends ProgramPrimitiveTypes> =
  T extends StringConstructor
    ? TypeStringSchemaOptions
    : T extends NumberConstructor
      ? TypeNumberSchemaOptions
      : T extends BooleanConstructor
        ? TypeBooleanSchemaOptions
        : never
