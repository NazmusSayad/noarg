import { NoArgProgram } from '@/noarg/noarg-program'
import { ProgramHandler, ProgramOptions, SystemConfig } from '@/types'
import { BuilderCore, BuilderProgram } from '.'

export class BuilderPortal<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> extends BuilderCore<TOptions, TConfig> {
  constructor(
    protected parentProgram: NoArgProgram<TOptions, TConfig>,
    options: TOptions,
    config: TConfig
  ) {
    super(options, config)
  }

  public createProgram(name: string, description?: string) {
    if (this.parentProgram.hasProgram(name)) {
      throw new Error(`Program ${name} already exists`)
    }

    return new BuilderProgram<{ name: string; description?: string }, TConfig>(
      this.parentProgram,
      { name, description },
      { ...this.config }
    )
  }

  public handler(handler: ProgramHandler<TOptions, TConfig>) {
    // @ts-expect-error Forgive me typescript
    this.parentProgram.setHandler(handler)
    return this
  }

  public getProgram() {
    return this.parentProgram
  }
}
