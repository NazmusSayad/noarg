import {
  ProgramHandler,
  ResolvedProgramConfig,
  ResolvedProgramOptions,
} from '@/types'

export class NoArgProgram<
  TOptions extends ResolvedProgramOptions,
  TConfig extends ResolvedProgramConfig,
> {
  protected programs: Map<
    string,
    NoArgProgram<ResolvedProgramOptions, ResolvedProgramConfig>
  > = new Map()

  constructor(
    protected options: TOptions,
    protected config: TConfig,
    protected handler: ProgramHandler<TOptions, TConfig>,
    protected parent?: NoArgProgram<
      ResolvedProgramOptions,
      ResolvedProgramConfig
    >
  ) {}

  public getName() {
    return this.options.name
  }
}
