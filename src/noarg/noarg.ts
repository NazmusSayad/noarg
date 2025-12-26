import {
  Program,
  ProgramArgument,
  ProgramArgumentOptions,
  ProgramConfig,
  ProgramHandler,
  ProgramOption,
  ProgramOptionOptions,
} from '@/program'
import { Prettify } from '@/utils/utils.type'
import {
  MapInternalArgumentSchemaType,
  MapInternalOptionSchemaType,
  ProgramPrimitiveTypes,
  ProgramUnifiedTypes,
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
  const TType extends ProgramUnifiedTypes,
  const TOptions extends ProgramOptionOptions,
>(name: TName, type: TType, options: TOptions) {
  type PrettifiedConfig = Prettify<
    TOptions & { readonly name: TName } & {
      readonly type: MapInternalOptionSchemaType<TType>
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
  const TType extends ProgramPrimitiveTypes,
  const TOptions extends ProgramArgumentOptions,
>(name: TName, type: TType, options: TOptions) {
  type PrettifiedConfig = Prettify<
    TOptions & { readonly name: TName } & {
      readonly type: MapInternalArgumentSchemaType<TType>
    }
  >

  return new ProgramArgument<PrettifiedConfig>({
    name,
    type,
    ...options,
  } as unknown as PrettifiedConfig)
}

export const noarg = { createProgram, option, argument }
