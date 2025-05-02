import { NoArgWrapper } from '@/noarg'
import {
  PartialProgramConfig,
  PartialProgramOptions,
  PartialSubProgramConfig,
  ProgramHandler,
} from '@/types'
import { MergeObject, Prettify } from '@/utils/utils.type'

export interface ProgramBuilder<
  TParentOptions extends PartialProgramOptions,
  TParentConfig extends PartialProgramConfig,
> {
  <
    const TOptions extends PartialProgramOptions,
    const TConfig extends PartialSubProgramConfig = {},
  >(
    options: PartialProgramOptions & TOptions,

    handler: ProgramHandler<
      Prettify<MergeObject<TParentOptions, TOptions>>,
      Prettify<MergeObject<TParentConfig, TConfig>>
    >,

    config?: PartialSubProgramConfig & TConfig
  ): ProgramBuilder<
    Prettify<MergeObject<TParentOptions, TOptions>>,
    Prettify<MergeObject<TParentConfig, TConfig>>
  >

  program: ProgramBuilder<TParentOptions, TParentConfig>
}

export interface AppBuilder<
  TParentOptions extends PartialProgramOptions,
  TParentConfig extends PartialProgramConfig,
> extends ProgramBuilder<Prettify<TParentOptions>, Prettify<TParentConfig>> {
  start: (args?: string[]) => void

  getProgram: () => NoArgWrapper<TParentOptions, TParentConfig>
}
