import { InternalProgramParserArgumentEntry } from '@/parser'
import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  ProgramArgumentConfig,
  ProgramArgumentOptions,
  ProgramOptionOptions,
} from './program.type'
import {
  GetLiteralToInternalSchemaOptions,
  LiteralBooleanType,
  LiteralEnumType,
  LiteralNumberType,
  LiteralPrimitiveUnionType,
  LiteralStringType,
  MapLiteralInternalSchemaType,
} from './types.type'
import { mapLiteralToInternalSchema } from './utils'

type ProgramArgumentTypes =
  | LiteralStringType
  | LiteralNumberType
  | LiteralBooleanType
  | LiteralEnumType
  | LiteralPrimitiveUnionType

export class ProgramArgument<const T extends ProgramArgumentConfig> {
  private readonly entity = 'argument' as const
  constructor(public readonly config: T) {}

  public toInternalArgumentSchema(): InternalProgramParserArgumentEntry {
    return {
      name: this.config.name,
      type: this.config.type,
      description: this.config.description,
    }
  }
}

function createArgument<const TName extends string>(
  name: TName
): ProgramArgument<
  Prettify<{
    readonly name: TName
    readonly type: MapLiteralInternalSchemaType<StringConstructor, {}>
  }>
>

function createArgument<
  const TName extends string,
  const TType extends ProgramArgumentTypes,
>(
  name: TName,
  type: TType
): ProgramArgument<
  Prettify<{
    readonly name: TName
    readonly type: MapLiteralInternalSchemaType<TType, {}>
  }>
>

function createArgument<
  const TName extends string,
  const TType extends ProgramArgumentTypes,
  const TOptions extends MergeTwoObjects<
    GetLiteralToInternalSchemaOptions<TType>,
    ProgramArgumentOptions
  >,
>(
  name: TName,
  type: TType,
  options: TOptions
): ProgramArgument<
  Prettify<
    Omit<TOptions, Exclude<keyof TOptions, keyof ProgramArgumentOptions>> & {
      readonly name: TName
      readonly type: MapLiteralInternalSchemaType<
        TType,
        Prettify<Omit<TOptions, keyof ProgramOptionOptions>>
      >
    }
  >
>

function createArgument<
  const TName extends string,
  const TType extends ProgramArgumentTypes,
  const TOptions extends MergeTwoObjects<
    GetLiteralToInternalSchemaOptions<TType>,
    ProgramArgumentOptions
  >,
>(name: TName, type?: TType, options?: TOptions) {
  type PrettifiedConfig = Prettify<
    Omit<TOptions, Exclude<keyof TOptions, keyof ProgramArgumentOptions>> & {
      readonly name: TName
      readonly type: MapLiteralInternalSchemaType<
        TType,
        Prettify<Omit<TOptions, keyof ProgramOptionOptions>>
      >
    }
  >

  const internalType = mapLiteralToInternalSchema(type ?? String, options)

  return new ProgramArgument<PrettifiedConfig>({
    ...options,
    type: internalType,
    name,
  } as unknown as PrettifiedConfig)
}

export { createArgument }
