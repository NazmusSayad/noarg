import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  GetInternalOptionSchemaOptions,
  MapInternalOptionSchemaType,
  ProgramOptionTypes,
} from './create.type'
import { ProgramOption } from './program'
import { ProgramOptionConfig, ProgramOptionOptions } from './program.type'
import { mapToInternalOptionSchemaType } from './utils'

function createOption<const TName extends string>(
  name: TName
): ProgramOption<
  Prettify<{
    readonly name: TName
    readonly type: MapInternalOptionSchemaType<StringConstructor, {}>
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
    readonly type: MapInternalOptionSchemaType<TType, {}>
  }>
>

function createOption<
  const TName extends string,
  const TType extends ProgramOptionTypes,
  const TOptions extends MergeTwoObjects<
    GetInternalOptionSchemaOptions<TType>,
    ProgramOptionOptions
  >,
>(
  name: TName,
  type: TType,
  options: TOptions
): ProgramOption<
  Prettify<
    ProgramOptionConfig & {
      readonly name: TName
      readonly type: MapInternalOptionSchemaType<TType, {}>
    }
  >
>

function createOption<
  const TName extends string,
  const TType extends ProgramOptionTypes,
  const TOptions extends MergeTwoObjects<
    GetInternalOptionSchemaOptions<TType>,
    ProgramOptionOptions
  >,
>(name: TName, type?: TType, options?: TOptions) {
  type ProgramOptions = Omit<
    TOptions,
    Exclude<keyof TOptions, keyof ProgramOptionOptions>
  >

  type TypeOptions = Omit<TOptions, keyof ProgramOptionOptions>

  type PrettifiedConfig = Prettify<
    ProgramOptions & {
      readonly name: TName
      readonly type: MapInternalOptionSchemaType<TType, Prettify<TypeOptions>>
    }
  >

  const internalType = mapToInternalOptionSchemaType(type ?? String)

  return new ProgramOption<PrettifiedConfig>({
    ...options,
    name,
    type: internalType,
  } as unknown as PrettifiedConfig)
}

export { createOption }
