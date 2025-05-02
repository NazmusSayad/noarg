import { AvailableLiteralType } from '@/runtime-type'
import {
  ProgramFlagOptions,
  ProgramHandler,
  ProgramOptions,
  SystemConfig,
} from '@/types'
import { Prettify } from '@/utils/utils.type'
import cloneDeep from 'lodash.clonedeep'
import { BuilderProgram, BuilderRoot } from '.'
import { InferConstructor } from './helpers.type'

export class BuilderCore<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> {
  constructor(
    protected options: TOptions,
    protected config: TConfig
  ) {}

  protected cloneInstance(
    options: ProgramOptions,
    config?: SystemConfig,
    handler?: ProgramHandler<ProgramOptions, SystemConfig>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    const clonedOptions = cloneDeep(options)
    const clonedConfig = cloneDeep({ ...this.config, ...config })

    if (this instanceof BuilderProgram) {
      return new BuilderProgram(
        // @ts-expect-error Forgive me typescript
        this.parentProgram,
        clonedOptions,
        { ...this.config, ...clonedConfig },
        handler
      )
    }

    if (this instanceof BuilderRoot) {
      return new BuilderRoot(clonedOptions, clonedConfig, handler)
    }

    throw new Error('Invalid instance type')
  }

  public flag<
    const TName extends string,
    const TType extends AvailableLiteralType,
    const TFlagConfig extends Prettify<
      ProgramFlagOptions & Partial<Record<'type1' | 'type2', unknown>>
    >,
  >(
    key: TName,
    type: TType,
    config?: TFlagConfig
  ): InferConstructor<
    this,
    Prettify<
      Omit<TOptions, 'flags'> & {
        flags: Prettify<
          Omit<TOptions['flags'], TName> & Record<TName, TFlagConfig>
        >
      }
    >,
    TConfig
  > {
    return this.cloneInstance({
      ...this.options,
      flags: {
        ...this.options.flags,
        [key]: { defaultValue: undefined },
      },
    })
  }
}
