import { MergeTwoObjects, Prettify } from '@/utils/utils.type'
import {
  GetInternalOptionSchemaOptions,
  MapInternalOptionSchemaType,
  ProgramOptionTypes,
} from './noarg.type'
import { ProgramOption } from './program'
import { ProgramOptionOptions } from './program.type'

function createOption<
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

export { createOption }
