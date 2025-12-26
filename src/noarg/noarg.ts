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
  return new Program<Prettify<NoInfer<TOptions>>>({
    ...options,
    handler,
  })
}

function option<
  const TName extends string,
  const TType extends ProgramOptionTypes,
  const TOptions extends MergeTwoObjects<
    GetInternalOptionSchemaOptions<TType>,
    ProgramOptionOptions
  >,
>(name: TName, type: TType, options: TOptions) {
  type ProgramOptions = Omit<
    NoInfer<TOptions>,
    keyof GetInternalOptionSchemaOptions<TType>
  >
  type TypeOptions = Omit<NoInfer<TOptions>, keyof ProgramOptionOptions>

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
  const TOptions extends MergeTwoObjects<
    GetInternalArgumentSchemaOptions<TType>,
    ProgramArgumentOptions
  >,
>(name: TName, type: TType, options: TOptions) {
  type ProgramOptions = Omit<
    NoInfer<TOptions>,
    keyof GetInternalArgumentSchemaOptions<TType>
  >

  type TypeOptions = Omit<NoInfer<TOptions>, keyof ProgramArgumentOptions>

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
