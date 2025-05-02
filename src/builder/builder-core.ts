import { AvailableLiteralType, PrimitiveLiteralType } from '@/runtime-type'
import { ProgramHandler, ProgramOptions, SystemConfig } from '@/types'
import { MergeObject, Prettify, UnReadonly } from '@/utils/utils.type'
import { BuilderProgram, InferAppOrProgram } from '.'
import {
  AddOptionalArgs,
  AddRequiredArgs,
  BuilderFlagConfig,
  BuilderListArgConfig,
  BuilderOptionalArgConfig,
  BuilderProgramOptions,
  BuilderRequiredArgConfig,
  GetGlobalFlags,
  MergeFlags,
} from './types'

export class BuilderCore<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> {
  protected actionHandler?: ProgramHandler<TOptions, TConfig> | null = null
  protected programMap: Map<
    string,
    BuilderProgram<ProgramOptions, SystemConfig>
  > = new Map()

  constructor(
    protected options: TOptions,
    protected configurations: TConfig
  ) {}

  public handle(handler: ProgramHandler<TOptions, TConfig>): this {
    this.actionHandler = handler
    return this
  }

  public program<
    const TName extends string,
    const TProgramOptions extends BuilderProgramOptions = {},
  >(name: TName, options?: TProgramOptions & BuilderProgramOptions) {
    if (this.programMap.has(name)) {
      throw new Error(`Program ${name} already exists`)
    }

    type NewOptions = { name: TName } & UnReadonly<TProgramOptions> & {
        flags: GetGlobalFlags<TOptions['flags']>
      }

    const program = new BuilderProgram<Prettify<NewOptions>, Prettify<TConfig>>(
      {
        name,
        description: options,
        flags: Object.fromEntries(
          Object.entries(this.options.flags ?? {}).filter(
            ([_, value]) => value.global
          )
        ),
      } as unknown as NewOptions,
      this.configurations
    )

    // @ts-expect-error Forced type
    this.programMap.set(name, program)

    return program
  }

  public flag<
    const TName extends string,
    const TType extends AvailableLiteralType,
    const TFlagConfig extends BuilderFlagConfig = {},
  >(
    key: TName,
    type: TType,
    config?: TFlagConfig & BuilderFlagConfig
  ): InferAppOrProgram<
    typeof this,
    MergeFlags<
      TOptions,
      { [K in TName]: Prettify<UnReadonly<TFlagConfig> & { type: TType }> }
    >,
    TConfig
  > {
    this.options.flags = {
      ...this.options.flags,
      [key]: { type, ...config },
    }

    this.actionHandler = null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  public arg<
    const TName extends string,
    const TType extends PrimitiveLiteralType,
    const TArgConfig extends BuilderRequiredArgConfig = {},
  >(
    name: TName,
    type: TType,
    config?: TArgConfig & BuilderRequiredArgConfig
  ): InferAppOrProgram<
    typeof this,
    MergeObject<
      TOptions,
      {
        args: AddRequiredArgs<
          TOptions['args'],
          Prettify<UnReadonly<TArgConfig> & { name: TName; type: TType }>
        >
      }
    >,
    TConfig
  > {
    this.options.args ??= []
    this.options.args.push({
      name,
      type,
      ...config,
    })

    this.actionHandler = null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  public optArg<
    const TName extends string,
    const TType extends PrimitiveLiteralType,
    const TOptArgConfig extends BuilderOptionalArgConfig = {},
  >(
    name: TName,
    type: TType,
    config?: TOptArgConfig & BuilderOptionalArgConfig
  ): InferAppOrProgram<
    typeof this,
    MergeObject<
      TOptions,
      {
        optArgs: AddOptionalArgs<
          TOptions['optArgs'],
          Prettify<UnReadonly<TOptArgConfig> & { name: TName; type: TType }>
        >
      }
    >,
    TConfig
  > {
    this.options.optArgs ??= []
    this.options.optArgs.push({
      name,
      type,
      ...config,
    })

    this.actionHandler = null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  public listArg<
    const TName extends string,
    const TType extends PrimitiveLiteralType,
    const TArgConfig extends BuilderListArgConfig = {},
  >(
    name: TName,
    type: TType,
    config?: TArgConfig & BuilderListArgConfig
  ): InferAppOrProgram<
    typeof this,
    MergeObject<
      TOptions,
      {
        listArg: Prettify<{ name: TName; type: TType } & UnReadonly<TArgConfig>>
      }
    >,
    TConfig
  > {
    this.options.listArg = {
      name,
      type,
      ...config,
    }

    this.actionHandler = null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  public __getOptions(): TOptions {
    return this.options
  }

  public __getConfig(): TConfig {
    return this.configurations
  }
}
