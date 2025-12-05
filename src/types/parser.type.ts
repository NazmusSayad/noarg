import { PartialProgramConfig } from '@/types/config.type'
import { PartialProgramOptions } from '@/types/options.type'
import { MergeObject, Prettify, UnReadonly } from '@/utils/utils.type'

export type ProgramHandler<
  TOptions extends PartialProgramOptions,
  TConfig extends PartialProgramConfig,
> = (
  options: Prettify<Readonly<MergeObject<{}, UnReadonly<TOptions>>>>,
  config: Prettify<Readonly<MergeObject<{}, UnReadonly<TConfig>>>>
) => void
