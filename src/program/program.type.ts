import { InternalArgumentSchemaType, InternalOptionSchemaType } from '@/parser'
import { ConcatNullableArray, Prettify } from '@/utils/utils.type'
import { ExtractProgramResult } from './extract.type'
import { ProgramArgument, ProgramOption } from './program'

export interface ProgramConfig {
  name: string
  description?: string

  options?: ProgramOption<ProgramOptionConfig>[]
  arguments?: ProgramArgument<ProgramArgumentConfig>[]
  optionalArguments?: ProgramArgument<ProgramArgumentConfig>[]
  additionalArguments?: ProgramArgument<ProgramArgumentConfig>
}

export type ProgramHandler<T extends ProgramConfig> = (
  result: Prettify<ExtractProgramResult<T>>
) => void

export type ProgramOptionOptions = {
  global?: boolean
  description?: string
}

export type ProgramOptionConfig = {
  name: string
  type: InternalOptionSchemaType
} & ProgramOptionOptions

export type ProgramArgumentOptions = {
  description?: string
}

export type ProgramArgumentConfig = {
  name: string
  type: InternalArgumentSchemaType
} & ProgramArgumentOptions

export type ExtractGlobalOptions<T> = T extends readonly [infer H, ...infer R]
  ? H extends ProgramOption<infer O>
    ? O extends { global: true }
      ? [H, ...ExtractGlobalOptions<R>]
      : ExtractGlobalOptions<R>
    : ExtractGlobalOptions<R>
  : []

export type MergeTwoProgramConfig<
  RootConfig extends ProgramConfig,
  SubConfig extends ProgramConfig,
> = Omit<SubConfig, 'options'> & {
  readonly options: ConcatNullableArray<
    ExtractGlobalOptions<RootConfig['options']>,
    SubConfig['options']
  >
}
