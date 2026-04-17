import { InternalProgramParserOptionEntry } from '@/parser'
import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import { ProgramOptionConfig, ProgramOptionOptions } from './program.type'
import {
  GetLiteralToInternalSchemaOptions,
  LiteralArrayType,
  LiteralBooleanType,
  LiteralEnumType,
  LiteralNoValueType,
  LiteralNumberType,
  LiteralPrimitiveUnionType,
  LiteralStringType,
  LiteralTupleType,
  MapLiteralInternalSchemaType,
} from './types.type'
import { mapLiteralToInternalSchema } from './utils'

type ProgramOptionTypes =
  | LiteralNoValueType
  | LiteralStringType
  | LiteralNumberType
  | LiteralBooleanType
  | LiteralEnumType
  | LiteralPrimitiveUnionType
  | LiteralArrayType
  | LiteralTupleType

export class ProgramOption<const T extends ProgramOptionConfig> {
  private readonly entity = 'option' as const
  constructor(public readonly config: T) {}

  public toInternalOptionSchema(): InternalProgramParserOptionEntry {
    return {
      name: this.config.name,
      type: this.config.type,
      description: this.config.description,
      askQuestion: this.config.askQuestion,
      aliases: this.config.aliases ?? [],
      required: this.config.required ?? false,
    }
  }
}

function createOption<const TName extends string>(
  name: TName
): ProgramOption<
  Prettify<{
    readonly name: TName
    readonly type: MapLiteralInternalSchemaType<StringConstructor, {}>
  }>
>

function createOption<
  const TName extends string,
  const TType extends ProgramOptionTypes,
>(
  name: TName,
  type: TType
): ProgramOption<
  Prettify<{
    readonly name: TName
    readonly type: MapLiteralInternalSchemaType<TType, {}>
  }>
>

function createOption<
  const TName extends string,
  const TType extends ProgramOptionTypes,
  const TOptions extends MergeTwoObjects<
    GetLiteralToInternalSchemaOptions<TType>,
    ProgramOptionOptions
  >,
>(
  name: TName,
  type: TType,
  options: TOptions
): ProgramOption<
  Prettify<
    Omit<TOptions, Exclude<keyof TOptions, keyof ProgramOptionOptions>> & {
      readonly name: TName
      readonly type: MapLiteralInternalSchemaType<
        TType,
        Prettify<Omit<TOptions, keyof ProgramOptionOptions>>
      >
    }
  >
>

function createOption<
  const TName extends string,
  const TType extends ProgramOptionTypes,
  const TOptions extends MergeTwoObjects<
    GetLiteralToInternalSchemaOptions<TType>,
    ProgramOptionOptions
  >,
>(name: TName, type?: TType, options?: TOptions) {
  type PrettifiedConfig = Prettify<
    Omit<TOptions, Exclude<keyof TOptions, keyof ProgramOptionOptions>> & {
      readonly name: TName
      readonly type: MapLiteralInternalSchemaType<
        TType,
        Prettify<Omit<TOptions, keyof ProgramOptionOptions>>
      >
    }
  >

  const internalType = mapLiteralToInternalSchema(
    type === undefined ? String : type,
    options
  )

  return new ProgramOption<PrettifiedConfig>({
    ...options,
    name,
    type: internalType,
  } as unknown as PrettifiedConfig)
}

export { createOption }
