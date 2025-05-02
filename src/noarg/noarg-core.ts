import { RequiredProgramOptions, RequiredSystemConfig } from '@/types'

export class NoArgCore<
  TOptions extends RequiredProgramOptions,
  TConfig extends RequiredSystemConfig,
> {
  protected programs: Map<
    string,
    NoArgCore<RequiredProgramOptions, RequiredSystemConfig>
  > = new Map()

  constructor(
    protected options: TOptions,
    protected config: TConfig
  ) {}

  public getName(): string {
    return this.options.name
  }
}
