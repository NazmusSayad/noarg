import { ProgramOptions, SystemConfig } from '@/types'
import { MergeObject, Prettify, UnReadonly } from '@/utils/utils.type'
import { BuilderCore } from '.'

export class BuilderApp<
  const TOptions extends ProgramOptions,
  const TConfig extends SystemConfig,
> extends BuilderCore<UnReadonly<TOptions>, UnReadonly<TConfig>> {
  protected name = 'NoArgBuilderApp' as const

  public configure<T extends SystemConfig>(
    config: T
  ): BuilderApp<TOptions, Prettify<MergeObject<TConfig, T>>> {
    this.configurations = { ...this.configurations, ...config }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }
}
