import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  GetInternalArgumentSchemaOptions,
  MapInternalArgumentSchemaType,
  ProgramArgumentTypes,
} from './noarg.type'
import { ProgramArgument } from './program'
import { ProgramArgumentOptions } from './program.type'

function createArgument<
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

export { createArgument }
