import { NoArgWrapper } from '@/noarg'
import {
  PartialProgramConfig,
  PartialSubProgramConfig,
} from '@/types/config.type'
import { PartialProgramOptions } from '@/types/options.type'
import { ProgramHandler } from '@/types/parser.type'
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
