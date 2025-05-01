import { ProgramHandler, ProgramOptions, SystemConfig } from '@/types'

export class NoArgProgram<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> {
  private programs: NoArgProgram<ProgramOptions, SystemConfig>[] = []

  constructor(
    public options: TOptions,
    public config: TConfig,
    public handler: ProgramHandler<TOptions, TConfig>
  ) {}

  public addProgram(program: NoArgProgram<ProgramOptions, SystemConfig>) {
    this.programs.push(program)
  }

  public run(args: string[]) {}
}
