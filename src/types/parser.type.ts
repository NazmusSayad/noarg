import { ProgramOptions, SystemConfig } from '@/types'
import { MergeObject, Prettify } from '@/utils/utils.type'

export type ProgramHandler<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> = (
  options: Readonly<Prettify<MergeObject<{}, TOptions>>>,
  config: Readonly<Prettify<MergeObject<{}, TConfig>>>
) => void
