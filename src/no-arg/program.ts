import { trustedSymbol } from '../constants/admin-symbol'
import { defaultOptions } from '../constants/config'
import ThrowExit from '../helpers/ThrowExit'
import colors from '../lib/colors'
import {
  DefaultOptions,
  ProgramConfig,
  ProgramOptions,
  RootSystemConfig,
} from '../types'
import { ExtractActionCallback } from '../types/extract.type'
import { MergeObject, Prettify } from '../utils/utils.type'
import { NoArgError, verifyNoArgSymbol } from './helpers'
import { NoArgParser } from './parser'

export class NoArgProgram<
  TName extends string,
  TSystem extends RootSystemConfig,
  TConfig extends ProgramConfig,
  TOptions extends ProgramOptions,
> extends NoArgParser<TName, TSystem, TConfig, TOptions> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected parent?: NoArgProgram<any, any, any, any>

  protected onActionCallback?: ExtractActionCallback<TSystem, TConfig, TOptions>

  constructor(
    symbol: symbol,
    name: TName,
    system: TSystem,
    config: TConfig,
    options: TOptions,

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parent?: NoArgProgram<any, any, any, any>
  ) {
    verifyNoArgSymbol(symbol, 'NoArgRoot')
    super(symbol, name, system, config, options)
    this.parent = parent
  }

  /**
   * Create a new NoArgProgramHelper instance
   *
   * @example
   *   const program = app.create('my-program', {
   *   ...
   *   })
   *
   * @param name The name of the program
   * @param options The options for the program
   * @returns A new NoArgProgramHelper instance
   */
  public create<
    const TName extends string,
    const TCreateOptionsWithConfig extends Partial<ProgramOptions> & {
      config?: Partial<ProgramConfig>
    },
  >(name: TName, { config, ...options }: TCreateOptionsWithConfig) {
    type TInnerConfig = NonNullable<TCreateOptionsWithConfig['config']>
    type TInnerOptions =
      Omit<TCreateOptionsWithConfig, 'config'> extends Partial<ProgramOptions> ?
        MergeObject<DefaultOptions, Omit<TCreateOptionsWithConfig, 'config'>>
      : never

    type TInnerOptionsWithGlobalFlags =
      TInnerConfig['skipGlobalFlags'] extends true ? TInnerOptions
      : MergeObject<
          TInnerOptions,
          {
            globalFlags: Prettify<
              MergeObject<TOptions['globalFlags'], TInnerOptions['globalFlags']>
            >
          }
        >

    type TChildConfig = Prettify<Required<MergeObject<TConfig, TInnerConfig>>>
    type TChildOptions = Prettify<Required<TInnerOptionsWithGlobalFlags>>

    const newConfig = {
      ...this.config,
      ...config,
    } as unknown as TChildConfig

    const newOptions: TChildOptions = {
      ...defaultOptions,
      ...{
        ...options,
        globalFlags:
          newConfig.skipGlobalFlags ?
            (options.globalFlags ?? defaultOptions.globalFlags)
          : {
              ...this.options.globalFlags,
              ...options.globalFlags,
            },
      },
    } as unknown as TChildOptions

    const child = new NoArgProgram<TName, TSystem, TChildConfig, TChildOptions>(
      trustedSymbol,
      name,
      this.system,
      newConfig,
      newOptions as TChildOptions,
      this
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.programs.set(name, child as any)

    return child
  }

  /**
   * Set the action of the program
   *
   * @example
   *   program.on((options, config, system) => {
   *     console.log(options)
   *   })
   */
  public on(callback: NonNullable<typeof this.onActionCallback>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.onActionCallback = callback as any
    return this
  }

  protected async startCore(args: string[]) {
    try {
      const result = await this.parseStart(args)
      if (!result) return

      const output = [
        {
          requiredArgs: result.requiredArgs,
          optionalArgs: result.optionalArgs,
          listArg: result.listArg,
          trailingArgs: result.trailingArgs,
          flags: result.flags,
        },
        { config: this.config, system: this.system },
      ] as Parameters<NonNullable<typeof this.onActionCallback>>

      this.onActionCallback?.(...output)
    } catch (error) {
      const canExit = !this.system.doNotExitOnError

      if (error instanceof ThrowExit) {
        if (error.message) {
          console.error(colors.red('Error:'), `${error.message}`)
        }

        if (!canExit) return
        return process.exit(error.code)
      }

      if (error instanceof NoArgError) {
        console.error(colors.red('Error:'), `${error.message}`)

        if (!canExit) return
        return process.exit(1)
      }

      throw error
    }
  }
}
