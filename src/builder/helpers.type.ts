import { ProgramOptions, SystemConfig } from '@/types'
import { BuilderProgram, BuilderRoot } from '.'

export type InferConstructor<
  T,
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> =
  T extends BuilderRoot<ProgramOptions, SystemConfig> ?
    BuilderRoot<TOptions, TConfig>
  : T extends BuilderProgram<ProgramOptions, SystemConfig> ?
    BuilderProgram<TOptions, TConfig>
  : never
