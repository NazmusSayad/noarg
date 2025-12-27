import { Prettify } from '@/utils/utils.type'
import {
  MergeTwoProgramConfig,
  ProgramArgumentConfig,
  ProgramConfig,
  ProgramHandler,
  ProgramOptionConfig,
} from './program.type'

export class Program<const TRootConfig extends ProgramConfig> {
  private readonly entity = 'program' as const
  constructor(private readonly config: TRootConfig) {}

  public create<
    const TName extends string,
    const TSubConfig extends Omit<ProgramConfig, 'name'>,
  >(
    name: TName,
    options: TSubConfig,
    handler?: ProgramHandler<
      MergeTwoProgramConfig<TRootConfig, TSubConfig & { readonly name: TName }>
    >
  ) {
    type PrettifiedConfig = Prettify<
      MergeTwoProgramConfig<TRootConfig, TSubConfig & { readonly name: TName }>
    >

    const mergedConfig = {
      ...options,
      name,
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

  public on(handler: ProgramHandler<TRootConfig>) {
    return new Program<TRootConfig>({
      ...this.config,
      handler,
    })
  }
}

export class ProgramArgument<const T extends ProgramArgumentConfig> {
  private readonly entity = 'argument' as const
  constructor(public readonly config: T) {}
}

export class ProgramOption<const T extends ProgramOptionConfig> {
  private readonly entity = 'option' as const
  constructor(public readonly config: T) {}
}
