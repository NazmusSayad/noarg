import { trustedSymbol } from '../constants/admin-symbol'
import {
  defaultConfig,
  defaultOptions,
  defaultSystemConfig,
} from '../constants/config'
import colors from '../lib/colors'
import { TSchemaPrimitive } from '../schema'
import { TypeArray } from '../schema/array'
import { TypeBoolean } from '../schema/boolean'
import { TypeNumber } from '../schema/number'
import { TypeString } from '../schema/string'
import { TypeTuple } from '../schema/tuple'
import {
  DefaultConfig,
  DefaultOptions,
  DefaultSystem,
  ProgramConfig,
  ProgramOptions,
  RootSystemConfig,
} from '../types'
import { ProgramCreateOptions } from '../types/global.type'
import { MergeObject, MergeObjectPrettify, Prettify } from '../utils/utils.type'
import { verifyNoArgSymbol } from './helpers'
import { NoArgProgram } from './program'

export class NoArgRoot<
  TName extends string,
  TSystem extends RootSystemConfig,
  TConfig extends ProgramConfig,
  TOptions extends ProgramOptions,
> extends NoArgProgram<TName, TSystem, TConfig, TOptions> {
  static colors = {
    disable() {
      colors.enabled = false
    },
    enable() {
      colors.enabled = true
    },
  }

  static boolean() {
    return new TypeBoolean({})
  }

  /**
   * Create a new string schema
   *
   * @example
   *   NoArg.string('a', 'b', 'c') // Only 'a', 'b', 'c' are allowed
   *
   * @param strings You can enter a fixed set of strings
   */
  static string<const T extends string[]>(...strings: T) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = {} as any
    if (strings.length) {
      config.enum = strings
    }

    return new TypeString(config as T extends [] ? object : { enum: T })
  }

  /**
   * Create a new number schema
   *
   * @example
   *   NoArg.number(1, 2, 3) // Only 1, 2, 3 are allowed
   *
   * @param numbers You can enter a fixed set of numbers
   */
  static number<const T extends number[]>(...numbers: T) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = {} as any

    if (numbers.length) {
      config.enum = numbers
    }

    return new TypeNumber(config as T extends [] ? object : { enum: T })
  }

  /** ### ⚠️ Only available for flags. */
  static array<const T extends TSchemaPrimitive>(type: T) {
    delete type.config.aliases
    delete type.config.default
    delete type.config.required
    delete type.config.askQuestion
    delete type.config.description

    const config = { schema: type }
    return new TypeArray(config)
  }

  /** ### ⚠️ Only available for flags. */
  static tuple<const T extends TSchemaPrimitive[]>(...types: T) {
    const config = {
      schema: types.map((s) => {
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
   *
   * @example
   *   const program = NoArgRoot.create('my-program', {
   *     description: 'This is my program',
   *     arguments: [
   *       { name: 'arg1', description: 'This is the first argument' },
   *     ],
   *     optionalArgs: [
   *       {
   *         name: 'opt1',
   *         description: 'This is the first optional argument',
   *       },
   *     ],
   *     flags: {
   *       flag1: t.string(),
   *     },
   *     globalFlags: {
   *       globalFlag1: t.string(),
   *     },
   *   })
   *
   *   program.start()
   *
   * @param name The name of the program
   * @param options The options for the program
   * @returns A new NoArgRoot instance
   */
  static create<
    const TName extends string,
    const TCreateConfig extends ProgramCreateOptions,
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
   *
   * - This doesn't do anything except returning the config
   * - This is a helper function to make the type inference better
   *
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

    super(trustedSymbol, name, system, config, options)
  }

  /**
   * Start the program
   *
   * @example
   *   program.start()
   *   program.start(['--flag1', 'value1'])
   *   program.start(['arg1', '--flag1', 'value1'])
   *   program.start(['arg1', '--flag1', 'value1', '--globalFlag1', 'value2'])
   *
   * @param args The arguments to start the program with
   */
  public start(args: string[] = process.argv.slice(2)) {
    this.startCore(args)
  }
}
