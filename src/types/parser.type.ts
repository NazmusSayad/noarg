import { ProgramOptions, SystemConfig } from '@/types'
import { Prettify } from '@/utils/utils.type'

export type ProgramHandler<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> = (
  options: Prettify<Readonly<TOptions>>,
  config: Prettify<Readonly<TConfig>>
) => void
