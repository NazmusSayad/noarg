import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  GetInternalArgumentSchemaOptions,
  MapInternalArgumentSchemaType,
  ProgramArgumentTypes,
} from './create.type'
import { ProgramArgument } from './program'
import {
  ProgramArgumentConfig,
  ProgramArgumentOptions,
  ProgramOptionOptions,
} from './program.type'
import { mapToInternalArgumentSchemaType } from './utils'

function createArgument<const TName extends string>(
  name: TName
): ProgramArgument<
  Prettify<{
    readonly name: TName
    readonly type: MapInternalArgumentSchemaType<StringConstructor, {}>
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
    readonly type: MapInternalArgumentSchemaType<TType, {}>
  }>
>

function createArgument<
  const TName extends string,
  const TType extends ProgramArgumentTypes,
  const TOptions extends MergeTwoObjects<
    GetInternalArgumentSchemaOptions<TType>,
    ProgramArgumentOptions
  >,
>(
  name: TName,
  type: TType,
  options: TOptions
): ProgramArgument<
  Prettify<
    ProgramArgumentConfig & {
      readonly name: TName
      readonly type: MapInternalArgumentSchemaType<TType, {}>
    }
  >
>

function createArgument<
  const TName extends string,
  const TType extends ProgramArgumentTypes,
  const TOptions extends MergeTwoObjects<
    GetInternalArgumentSchemaOptions<TType>,
    ProgramArgumentOptions
  >,
>(name: TName, type?: TType, options?: TOptions) {
  type ProgramOptions = Omit<
    TOptions,
    Exclude<keyof TOptions, keyof ProgramArgumentOptions>
  >

  type TypeOptions = Omit<TOptions, keyof ProgramOptionOptions>

  type PrettifiedConfig = Prettify<
    ProgramOptions & {
      readonly name: TName
      readonly type: MapInternalArgumentSchemaType<TType, Prettify<TypeOptions>>
    }
  >

  const internalType = mapToInternalArgumentSchemaType(type ?? String)

  return new ProgramArgument<PrettifiedConfig>({
    ...options,
    type: internalType,
    name,
  } as unknown as PrettifiedConfig)
}

export { createArgument }
