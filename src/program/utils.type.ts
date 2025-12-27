import { ConcatNullableArray } from '@/utils/utils.type'
import { ProgramOption } from './create-option'
import { ProgramConfig } from './program.type'

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
