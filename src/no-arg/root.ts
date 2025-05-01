import colors from '../lib/colors'
import { trustedSymbol, verifySymbol } from '../constants/admin-symbol'
import {
  RootSystemConfig,
  ProgramConfig,
  ProgramOptions,
  DefaultSystem,
  DefaultConfig,
  DefaultOptions,
} from '../types'
import { TypeArray } from '../schema/array'
import { TypeTuple } from '../schema/tuple'
import { TypeNumber } from '../schema/number'
import { TypeString } from '../schema/string'
import { TypeBoolean } from '../schema/boolean'
import { TSchemaPrimitive } from '../schema'
import { NoArgProgram } from './program'
import { MergeObject, MergeObjectPrettify, Prettify } from '../utils/utils.type'
import {
  defaultConfig,
  defaultOptions,
  defaultSystemConfig,
} from '../constants/config'
import { ProgramCreateOptions } from '../types/global.type'
import { verifyNoArgSymbol } from './helpers'

export class NoArgRoot<
  TName extends string,
  TSystem extends RootSystemConfig,
  TConfig extends ProgramConfig,
  TOptions extends ProgramOptions
> extends NoArgProgram<TName, TSystem, TConfig, TOptions> {
  static colors = {
    disable() {
      colors.enabled = false
    },
    enable() {
      colors.enabled = true
    },
  }

  /**
   * Create a new string schema
   * @param strings You can enter a fixed set of strings
   * @example
   * NoArg.string('a', 'b', 'c') // Only 'a', 'b', 'c' are allowed
   */
  static string<const T extends string[]>(...strings: T) {
    const config = {} as any
    if (strings.length) {
      config.enum = new Set(strings)
    }

    return new TypeString(
      config as T extends [] ? {} : { enum: Set<T[number]> }
    )
  }

  /**
   * Create a new number schema
   * @param numbers You can enter a fixed set of numbers
   * @example
   * NoArg.number(1, 2, 3) // Only 1, 2, 3 are allowed
   */
  static number<const T extends number[]>(...numbers: T) {
    const config = {} as any
    if (numbers.length) {
      config.enum = new Set(numbers)
    }

    return new TypeNumber(
      config as T extends [] ? {} : { enum: Set<T[number]> }
    )
  }

  static boolean() {
    return new TypeBoolean({})
  }

  /**
   * ### ⚠️ Only available for flags.
   */
  static array<T extends TSchemaPrimitive>(schema: T) {
    delete schema.config.aliases
    delete schema.config.default
    delete schema.config.required
    delete schema.config.askQuestion
    delete schema.config.description

    const config = { schema }
    return new TypeArray(config)
  }

  /**
   * ### ⚠️ Only available for flags.
   */
  static tuple<T extends TSchemaPrimitive[]>(...schema: T) {
    const config = {
      schema: schema.map((s) => {
        s.config.required = true
        delete s.config.aliases
        delete s.config.askQuestion
        delete s.config.description

        return s
      }),
    }
    return new TypeTuple(config)
  }

  /**
   * Create a new NoArgRoot instance
   * @param name The name of the program
   * @param options The options for the program
   * @returns A new NoArgRoot instance
   * @example
   * const program = NoArgRoot.create('my-program', {
   *  description: 'This is my program',
   *  arguments: [
   *    { name: 'arg1', description: 'This is the first argument' }
   *  ],
   *  optionalArgs: [
   *    { name: 'opt1', description: 'This is the first optional argument' }
   *  ],
   *  flags: {
   *    flag1: t.string()
   *  },
   *  globalFlags: {
   *    globalFlag1: t.string()
   *  }
   * })
   *
   * program.start()
   */
  static create<
    const TName extends string,
    const TCreateConfig extends ProgramCreateOptions
  >(name: TName, { config, system, ...options }: TCreateConfig) {
    type TSystem = MergeObjectPrettify<
      DefaultSystem,
      Required<NonNullable<TCreateConfig['system']>>
    >

    type TConfig = MergeObjectPrettify<
      DefaultConfig,
      Required<NonNullable<TCreateConfig['config']>>
    >

    type TOptions = Prettify<
      Required<
        MergeObject<DefaultOptions, Omit<TCreateConfig, 'config' | 'system'>>
      >
    >

    return new NoArgRoot<TName, TSystem, TConfig, TOptions>(
      trustedSymbol,
      name,
      {
        ...defaultSystemConfig,
        ...system,
      } as TSystem,
      {
        ...defaultConfig,
        ...config,
      } as TConfig,
      {
        ...defaultOptions,
        ...options,
      } as unknown as TOptions
    )
  }

  /**
   * Define the configuration for the program
   * - This doesn't do anything except returning the config
   * - This is a helper function to make the type inference better
   * @param config The configuration for the program
   */
  static defineConfig<const T extends ProgramCreateOptions>(config: T) {
    return config as Prettify<T>
  }

  constructor(
    symbol: symbol,
    name: TName,
    system: TSystem,
    config: TConfig,
    options: TOptions
  ) {
    verifyNoArgSymbol(symbol, 'NoArgRoot')
    super(trustedSymbol, name, system, config, options as any)
  }

  /**
   * Start the program
   * @param args The arguments to start the program with
   * @example
   * program.start()
   * program.start(['--flag1', 'value1'])
   * program.start(['arg1', '--flag1', 'value1'])
   * program.start(['arg1', '--flag1', 'value1', '--globalFlag1', 'value2'])
   */
  public start(args: string[] = process.argv.slice(2)) {
    this.startCore(args)
  }
}
