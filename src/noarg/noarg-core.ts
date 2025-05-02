import { ResolvedProgramOptions, ResolvedSystemConfig } from '@/types'

export class NoArgCore<
  TOptions extends ResolvedProgramOptions,
  TConfig extends ResolvedSystemConfig,
> {
  protected programs: Map<
    string,
    NoArgCore<ResolvedProgramOptions, ResolvedSystemConfig>
  > = new Map()

  constructor(
    protected options: TOptions,
    protected config: TConfig
  ) {}

  public getName(): string {
    return this.options.name
  }
}
