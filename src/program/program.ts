import { Prettify } from '@/utils/utils.type'
import {
  MergeTwoProgramConfig,
  ProgramArgumentConfig,
  ProgramConfig,
  ProgramHandler,
  ProgramOptionConfig,
} from './program.type'

export class Program<const TRootConfig extends ProgramConfig> {
  public readonly entity = 'program' as const
  constructor(private readonly config: TRootConfig) {}

  public create<const TSubConfig extends Omit<ProgramConfig, 'handler'>>(
    options: TSubConfig,
    handler: ProgramHandler<MergeTwoProgramConfig<TRootConfig, TSubConfig>>
  ) {
    type PrettifiedConfig = Prettify<
      MergeTwoProgramConfig<TRootConfig, TSubConfig>
    >

    const mergedConfig = {
      ...options,
      options: [
        ...(this.config.options ?? []).filter((option) => option.config.global),
        ...(options.options ?? []),
      ],
    } as unknown as PrettifiedConfig

    return new Program<PrettifiedConfig>({
      ...mergedConfig,
      handler,
    })
  }
}

export class ProgramArgument<const T extends ProgramArgumentConfig> {
  public readonly entity = 'argument' as const
  constructor(public readonly config: T) {}
}

export class ProgramOption<const T extends ProgramOptionConfig> {
  public readonly entity = 'option' as const
  constructor(public readonly config: T) {}
}
