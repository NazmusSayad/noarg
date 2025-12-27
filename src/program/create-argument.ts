import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  GetInternalArgumentSchemaOptions,
  MapInternalArgumentSchemaType,
  ProgramArgumentTypes,
} from './create.type'
import { ProgramArgument } from './program'
import { ProgramArgumentOptions, ProgramOptionOptions } from './program.type'
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
    Omit<TOptions, Exclude<keyof TOptions, keyof ProgramArgumentOptions>> & {
      readonly name: TName
      readonly type: MapInternalArgumentSchemaType<
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
    GetInternalArgumentSchemaOptions<TType>,
    ProgramArgumentOptions
  >,
>(name: TName, type?: TType, options?: TOptions) {
  type PrettifiedConfig = Prettify<
    Omit<TOptions, Exclude<keyof TOptions, keyof ProgramArgumentOptions>> & {
      readonly name: TName
      readonly type: MapInternalArgumentSchemaType<
        TType,
        Prettify<Omit<TOptions, keyof ProgramOptionOptions>>
      >
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
