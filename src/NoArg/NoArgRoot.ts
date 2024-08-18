import adminSymbol from './admin-symbol'
import { NoArgProgram } from './NoArgProgram'
import { MergeObject, Prettify } from '../types/util.t'
import { NoArgCore } from './NoArgCore'

export class NoArgRoot<
  TName extends string,
  TSystem extends NoArgCore.System,
  TConfig extends NoArgProgram.Config,
  TOptions extends NoArgCore.Options
> extends NoArgProgram<TName, TSystem, TConfig, TOptions> {
  constructor(
    symbol: symbol,
    name: TName,
    system: TSystem,
    config: TConfig,
    options: TOptions
  ) {
    if (symbol !== adminSymbol) {
      throw new Error(
        'NoArg is not meant to be instantiated directly. Use NoArgProgram.create() instead. But if really need this contact the developer. This is disabled just for safety.'
      )
    }

    super(name, system, config, options as any)
  }

  static create<
    const TName extends string,
    const TCreateConfig extends Prettify<
      Partial<NoArgCore.Options> & {
        config?: NoArgCore.Config
        system?: Partial<NoArgCore.System>
      }
    >
  >(name: TName, { config, system, ...options }: TCreateConfig) {
    system = { ...NoArgCore.defaultSystem, ...system }
    config = { ...config }

    type TSystem = MergeObject<
      NoArgCore.DefaultSystem,
      Required<NonNullable<TCreateConfig['system']>>
    >

    type TOptions = MergeObject<
      NoArgCore.DefaultOptions,
      Omit<TCreateConfig, 'config' | 'system'>
    >

    type TConfig = NonNullable<TCreateConfig['config']>
    return new NoArgRoot<
      TName,
      Prettify<TSystem>,
      Prettify<TConfig>,
      Prettify<Required<TOptions>>
    >(
      adminSymbol,
      name,
      system as any,
      config as any,
      {
        ...NoArgCore.defaultOptions,
        ...options,
      } as any
    )
  }

  public start(args: string[] = process.argv.slice(2)) {
    return this.startCore(args)
  }
}

export module NoArgRoot {}
