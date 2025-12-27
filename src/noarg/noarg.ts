import {
  Program,
  ProgramArgument,
  ProgramArgumentOptions,
  ProgramConfig,
  ProgramHandler,
  ProgramOption,
  ProgramOptionOptions,
} from '@/program'
import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  GetInternalArgumentSchemaOptions,
  GetInternalOptionSchemaOptions,
  MapInternalArgumentSchemaType,
  MapInternalOptionSchemaType,
  ProgramArgumentTypes,
  ProgramOptionTypes,
} from './noarg.type'

function createProgram<const TOptions extends Omit<ProgramConfig, 'handler'>>(
  options: TOptions,
  handler: ProgramHandler<TOptions>
) {
  return new Program<Prettify<TOptions>>({
    ...options,
    handler,
  })
}

function option<
  const TName extends string,
  const TType extends ProgramOptionTypes,
  const TOptions extends
    | {}
    | MergeTwoObjects<
        GetInternalOptionSchemaOptions<TType>,
        ProgramOptionOptions
      >,
>(name: TName, type: TType, options: TOptions = {} as TOptions) {
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

  return new ProgramOption<PrettifiedConfig>({
    name,
    type,
    ...options,
  } as unknown as PrettifiedConfig)
}

function argument<
  const TName extends string,
  const TType extends ProgramArgumentTypes,
  const TOptions extends
    | {}
    | MergeTwoObjects<
        GetInternalArgumentSchemaOptions<TType>,
        ProgramArgumentOptions
      >,
>(name: TName, type: TType, options: TOptions = {} as TOptions) {
  type ProgramOptions = Omit<
    TOptions,
    Exclude<keyof TOptions, keyof ProgramArgumentOptions>
  >

  type TypeOptions = Omit<TOptions, keyof ProgramArgumentOptions>

  type PrettifiedConfig = Prettify<
    ProgramOptions & {
      readonly name: TName
      readonly type: MapInternalArgumentSchemaType<TType, Prettify<TypeOptions>>
    }
  >

  return new ProgramArgument<PrettifiedConfig>({
    name,
    type,
    ...options,
  } as unknown as PrettifiedConfig)
}

export const noarg = { createProgram, option, argument }
