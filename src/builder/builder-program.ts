import { NoArgProgram } from '@/noarg/noarg-program'
import { ProgramHandler, ProgramOptions, SystemConfig } from '@/types'
import cloneDeep from 'lodash.clonedeep'
import { BuilderPortal } from './builder-portal'

export class BuilderProgram<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> extends BuilderPortal<TOptions, TConfig> {
  constructor(
    protected parentProgram: NoArgProgram<TOptions, TConfig>,
    options: TOptions,
    config: TConfig,
    handler?: ProgramHandler<ProgramOptions, SystemConfig>
  ) {
    const noargProgram = new NoArgProgram(
      cloneDeep({ ...options }),
      cloneDeep({ ...config })
    )

    if (handler) {
      noargProgram.setHandler(handler)
    }

    parentProgram.setProgram(noargProgram)
    super(noargProgram, options, config)
  }
}
