import { NoArgProgram } from '@/noarg/noarg-program'
import { ProgramHandler, ProgramOptions, SystemConfig } from '@/types'
import { BuilderPortal } from './builder-portal'

export class BuilderRoot<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> extends BuilderPortal<TOptions, TConfig> {
  protected program: NoArgProgram<TOptions, TConfig>

  constructor(
    options: TOptions,
    config: TConfig,
    handler?: ProgramHandler<ProgramOptions, SystemConfig>
  ) {
    const program = new NoArgProgram({ ...options }, { ...config })

    if (handler) {
      program.setHandler(handler)
    }

    super(program, options, config)
    this.program = program
  }

  public static createApp(name: string, description?: string) {
    return new BuilderRoot({ name, description }, {})
  }

  public start(args: string[] = process.argv.slice(2)) {
    this.program.run(args)
  }
}
