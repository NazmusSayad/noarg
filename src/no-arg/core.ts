import { CellValue } from 'cli-table3'
import { CustomTable } from '../helpers/custom-table'
import validateFlagName from '../helpers/validate-flag-name'
import colors from '../lib/colors'
import { TypeArray } from '../schema/array'
import { TypeNumber } from '../schema/number'
import { TypeString } from '../schema/string'
import { TypeTuple } from '../schema/tuple'
import {
  BaseConfig,
  FlagOption,
  NoArgProgramMap,
  ProgramOptions,
  RootSystemConfig,
} from '../types'
import { getArrayLengthStr } from '../utils'
import { validateNonEmptyString } from '../utils/string'
import { verifyNoArgSymbol } from './helpers'

export class NoArgCore<
  TName extends string,
  TSystem extends RootSystemConfig,
  TConfig extends BaseConfig,
  TOptions extends ProgramOptions,
> {
  protected programs: NoArgProgramMap = new Map()

  constructor(
    symbol: symbol,
    protected name: TName,
    protected system: TSystem,
    protected config: TConfig,
    protected options: TOptions
  ) {
    verifyNoArgSymbol(symbol, 'NoArgCore')

    if (typeof system.booleanNotSyntaxEnding === 'string') {
      validateNonEmptyString(
        system.booleanNotSyntaxEnding,
        'system.booleanNotSyntaxEnding'
      )
    }

    if (options.trailingArgs) {
      validateNonEmptyString(options.trailingArgs, 'options.trailingArgs')
    }

    if (options.flags) {
      Object.keys(options.flags).forEach((name) => {
        validateFlagName(name, system.booleanNotSyntaxEnding || undefined)
      })
    }

    if (options.globalFlags) {
      Object.keys(options.globalFlags).forEach((name) => {
        validateFlagName(name, system.booleanNotSyntaxEnding || undefined)
      })
    }

    this.system = Object.freeze({ ...system })
    this.config = Object.freeze({ ...config })
    this.options = Object.freeze({ ...options })
  }

  private colors = {
    type: colors.yellow,
    description: colors.reset,
    programs: colors.magenta,
    arguments: colors.blue,
    flags: colors.cyan,
    trailingArgs: colors.green,
    emptyString: colors.dim('┈'),
  }

  private renderHelpIntro() {
    console.log(
      colors.cyan.bold(this.name),
      this.options.description ?
        this.colors.description(this.options.description)
      : ''
    )
  }

  private renderHelpUsageIntro() {
    console.log(colors.bold('Usage:'))

    if (this.options.customRenderHelp?.helpUsageStructure) {
      return console.log(
        colors.cyan('$'),
        this.options.customRenderHelp?.helpUsageStructure
      )
    }

    const commandItems: string[] = [colors.dim(this.name)]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(function getParent(current: any) {
      if (!current.parent) return
      commandItems.unshift(current.parent.name)
      getParent(current.parent)
    })(this)

    if (this.programs.size) {
      commandItems.push(this.colors.programs('[' + 'program' + ']'))
    }

    this.options.requiredArgs.forEach((argument) => {
      commandItems.push(this.colors.arguments(`<${argument.name}>`))
    })

    this.options.optionalArgs.forEach((argument) => {
      commandItems.push(this.colors.arguments(`<${argument.name}>`) + '?')
    })

    if (this.options.listArg) {
      commandItems.push(
        this.colors.arguments('...[' + this.options.listArg.name + ']')
      )
    }

    if (
      Object.keys(this.options.flags).length ||
      Object.keys(this.options.globalFlags).length
    ) {
      commandItems.push(this.colors.flags('--[flags]'))
    }

    if (this.options.trailingArgs) {
      commandItems.push(
        this.colors.description(this.options.trailingArgs),
        this.colors.description(
          this.options.customRenderHelp?.helpUsageTrailingArgsLabel ??
            `[...trailing-args]`
        )
      )
    }

    console.log([colors.cyan('$'), ...commandItems].filter(Boolean).join(' '))
  }

  private renderHelpPrograms() {
    console.log(colors.bold('Programs:'))

    const programData = Array.from(this.programs).map<[CellValue, CellValue]>(
      ([name, program]) => [
        this.colors.programs(name),
        this.colors.description(
          program.options.description ?? this.colors.emptyString
        ),
      ]
    )

    CustomTable(
      {
        sizes: [{ flex: 5, maxWidth: 20 }, { flex: 13 }],
        border: this.system.enableHelpBoxBorder,
      },
      ...programData
    )
  }

  private renderHelpArguments() {
    console.log(colors.bold('Arguments:'))
    const tables = [] as [CellValue, CellValue, CellValue][]

    this.options.requiredArgs.forEach((argument) => {
      const { name, type } = argument
      tables.push([
        this.colors.arguments(name),
        this.colors.type(type.name),
        this.colors.description(
          argument.description ?? this.colors.emptyString
        ),
      ])
    })

    this.options.optionalArgs.forEach((argument) => {
      const { name, type } = argument
      tables.push([
        this.colors.arguments(name),
        this.colors.type(type.name) + '?',
        this.colors.description(
          argument.description ?? this.colors.emptyString
        ),
      ])
    })

    if (this.options.listArg) {
      const { name, type, minLength, maxLength, description } =
        this.options.listArg

      tables.push([
        this.colors.arguments(name),
        this.colors.type(type.name) +
          `[${getArrayLengthStr(minLength, maxLength)}]` +
          (minLength && minLength > 0 ? '' : '?'),

        this.colors.description(description ?? this.colors.emptyString),
      ])
    }

    CustomTable(
      {
        sizes: [
          { flex: 6, maxWidth: 20 },
          { flex: 5, maxWidth: 20 },
          { flex: 10 },
        ],
        border: this.system.enableHelpBoxBorder,
      },
      ...tables
    )
  }

  private renderHelpFlags(flags: FlagOption) {
    const optionData = Object.entries(flags)
      .sort(([keyA], [keyB]) => {
        if (keyA > keyB) return 1
        if (keyA < keyB) return -1
        return 0
      })
      .sort(([, aSchema], [, bSchema]) => {
        const aIsMust =
          aSchema.config.required &&
          aSchema.config.default === undefined &&
          aSchema.config.askQuestion === undefined

        const bIsMust =
          bSchema.config.required &&
          bSchema.config.default === undefined &&
          bSchema.config.askQuestion === undefined

        return (
          aIsMust === bIsMust ? 0
          : aIsMust ? -1
          : 1
        )
      })

      .map<[CellValue, CellValue, CellValue]>(([name, schema]) => {
        const aliasString =
          schema.config.aliases ?
            `-${schema.config.aliases
              .map((alias) => this.colors.flags(alias))
              .join('\n -')}`
          : ''

        const optionName =
          '--' +
          this.colors.flags(name) +
          (aliasString ? '\n ' + aliasString : '')

        const optionType =
          (schema instanceof TypeArray ?
            this.colors.type(schema.config.schema.name) +
            `[${getArrayLengthStr(
              schema.config.minLength,
              schema.config.maxLength
            )}]`
          : schema instanceof TypeTuple ?
            '[' +
            schema.config.schema
              .map((schema) => this.colors.type(schema.name))
              .join(', ') +
            ']'
          : this.colors.type(schema.name)) +
          ((
            schema.config.required &&
            schema.config.default === undefined &&
            schema.config.askQuestion === undefined
          ) ?
            ''
          : '?')

        const enumValues =
          (
            (schema instanceof TypeString || schema instanceof TypeNumber) &&
            schema.config.enum?.length
          ) ?
            colors.blue('\nChoices: ') +
            [...schema.config.enum.values()]
              .map((item) => colors.green(String(item)))
              .join(', ')
          : ''

        return [
          optionName,
          optionType,
          this.colors.description(
            ((schema.config.description ?? '') + enumValues).trim() ||
              this.colors.emptyString
          ),
        ]
      })

    CustomTable(
      {
        sizes: [
          { flex: 6, maxWidth: 20 },
          { flex: 5, maxWidth: 20 },
          { flex: 10 },
        ],
        border: this.system.enableHelpBoxBorder,
      },
      ...optionData
    )
  }

  /**
   * Render the help of the program
   *
   * @example
   *   program.renderHelp()
   */
  public renderHelp() {
    this.renderHelpIntro()
    console.log('')

    this.renderHelpUsageIntro()
    console.log('')

    if (this.programs.size) {
      this.renderHelpPrograms()
      console.log('')
    }

    if (
      this.options.requiredArgs.length ||
      this.options.optionalArgs.length ||
      this.options.listArg
    ) {
      this.renderHelpArguments()
      console.log('')
    }

    const hasFlags = Object.keys(this.options.flags).length
    const hasGlobalFlags = Object.keys(this.options.globalFlags).length

    if (hasFlags || hasGlobalFlags) {
      console.log(colors.bold('Flags:'))

      if (hasFlags) this.renderHelpFlags(this.options.flags)
      if (hasGlobalFlags) this.renderHelpFlags(this.options.globalFlags)

      console.log('')
    }

    if (this.options.trailingArgs) {
      console.log(colors.bold('Trailing Arguments:'))

      console.log(
        ` These arguments are ${colors.red(
          'ignored'
        )} by the program and are passed as is.`
      )

      console.log('')
    }

    if (this.options.notes?.length) {
      console.log(colors.bold('Notes:'))
      this.options.notes.forEach((note) => {
        console.log(' -', colors.dim(note))
      })

      console.log('')
    }

    if (this.config.help) {
      console.log(colors.bold('Tips:'))
      console.log(
        ' Use',
        colors.yellow('--help-usage'),
        'or',
        colors.yellow('-hu'),
        'flag to see how to use the program'
      )
    }
  }

  private renderUsageUtils = {
    printValid(...args: string[]) {
      console.log('  ', colors.green('✔   ' + args.join(' ')))
    },

    printInvalid(...args: string[]) {
      console.log('  ', colors.red('✖   ' + args.join(' ')))
    },

    printGroupHeader(...args: string[]) {
      console.log(' ⚙︎', colors.dim(args.join(' ')))
    },

    printPointHeader(...args: string[]) {
      console.log('   -', colors.dim(args.join(' ')))
    },

    tableGroup(name: string, result: string, ...args: string[]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return [name, args.join('\n'), result] as any
    },
  }

  private renderUsageStructure() {
    console.log(
      colors.green('$'),
      this.colors.programs('programs'),
      this.colors.arguments('fixed-arguments'),
      this.colors.arguments('optional-arguments'),
      this.colors.arguments('list-arguments'),
      this.colors.flags('flags'),
      this.colors.trailingArgs('trailing-args')
    )

    console.log(
      '',
      "This is the structure of the command line. It's the order of the arguments and options that you want to pass to the command. The order is important and can't be changed."
    )

    console.log('')
    this.renderUsageUtils.printPointHeader(this.colors.programs('programs'))
    console.log(
      '',
      "This is the command that you want to run. It's the first argument of the command line."
    )

    console.log('')
    this.renderUsageUtils.printPointHeader(
      this.colors.arguments('fixed-arguments')
    )
    console.log(
      '',
      "These are the arguments that you want to pass to the command. Their position and length is fixed and can't be changed."
    )

    console.log('')
    this.renderUsageUtils.printPointHeader(
      this.colors.arguments('optional-arguments')
    )
    console.log(
      '',
      'These are the arguments that you want to pass to the command. They are optional and can be changed.'
    )

    console.log('')
    this.renderUsageUtils.printPointHeader(
      this.colors.arguments('list-arguments')
    )
    console.log(
      '',
      'These are the arguments that you want to pass to the command. They are list of values and length can vary on configuration. They also can be optional.'
    )

    console.log('')
    this.renderUsageUtils.printPointHeader(this.colors.flags('flags'))
    console.log(
      '',
      'These are the options that you want to pass to the command. They are optional and can be changed.'
    )

    console.log('')
    this.renderUsageUtils.printPointHeader(
      this.colors.trailingArgs('trailing-args')
    )
    console.log(
      '',
      'These are the arguments that are passed to the command after the trailing-args separator. They are passed as is and are ignored by the program.'
    )
  }

  private renderUsageHowToUseOptions() {
    CustomTable(
      {
        sizes: [
          { flex: 1, minWidth: 8, maxWidth: 20 },
          { flex: 3, maxWidth: 40 },
          { flex: 2, maxWidth: 40 },
        ],
        border: this.system.enableHelpBoxBorder,
      },
      this.renderUsageUtils.tableGroup(
        'string',
        'string',
        '--string string',
        '--string=string'
      ),

      this.renderUsageUtils.tableGroup(
        'number',
        '100',
        '--number 100',
        '--number=100'
      ),

      this.renderUsageUtils.tableGroup(
        'boolean\n(true)',
        'true',
        '--boolean',
        '--boolean true',
        '--boolean=true',
        '--boolean yes',
        '--boolean=yes',
        colors.dim("* Casing doesn't matter"),
        '--boolean YeS'
      ),

      this.renderUsageUtils.tableGroup(
        'boolean\n(false)',
        'false',
        '--boolean' + this.system.booleanNotSyntaxEnding,
        '--boolean false',
        '--boolean=false',
        '--boolean no',
        '--boolean=no',
        colors.dim("* Casing doesn't matter"),
        '--boolean fAlSe'
      ),

      this.renderUsageUtils.tableGroup(
        'array\ntuple',
        "['value1', 'value2']",
        '--option value1 value2',
        '--option=value1 value2'
      )
    )
  }

  private renderUsageProgramConfiguration() {
    if (this.config.help) {
      this.renderUsageUtils.printGroupHeader('Auto Help flag is enabled')
      this.renderUsageUtils.printValid(colors.yellow('--help'))
      this.renderUsageUtils.printValid(colors.yellow('--help-usage'))
      this.renderUsageUtils.printValid(colors.yellow('-h'))
      this.renderUsageUtils.printValid(colors.yellow('-hu'))
    } else {
      this.renderUsageUtils.printGroupHeader('Auto Help flag is disabled')
      this.renderUsageUtils.printInvalid(colors.yellow('--help'))
      this.renderUsageUtils.printInvalid(colors.yellow('--help-usage'))
      this.renderUsageUtils.printInvalid(colors.yellow('-h'))
      this.renderUsageUtils.printInvalid(colors.yellow('-hu'))
    }
  }

  private renderUsageSystemConfiguration() {
    if (this.system.allowEqualAssign) {
      this.renderUsageUtils.printGroupHeader(
        'Options with equal value is enabled'
      )
      this.renderUsageUtils.printValid(colors.yellow('--option'), 'value')
      this.renderUsageUtils.printValid(
        colors.yellow('--option') + colors.blue('=') + 'value'
      )
    } else {
      this.renderUsageUtils.printGroupHeader(
        'Options with equal value is disabled'
      )
      this.renderUsageUtils.printValid(colors.yellow('--option'), 'value')
      this.renderUsageUtils.printInvalid(
        colors.yellow('--option') + colors.blue('=') + 'value'
      )
    }

    if (this.system.booleanNotSyntaxEnding) {
      this.renderUsageUtils.printGroupHeader(
        'Boolean not syntax ending is enabled'
      )

      this.renderUsageUtils.printValid(colors.yellow('--option'))
      this.renderUsageUtils.printValid(
        colors.yellow('--option' + this.system.booleanNotSyntaxEnding)
      )
    } else {
      this.renderUsageUtils.printGroupHeader(
        'Boolean not syntax ending is disabled'
      )

      this.renderUsageUtils.printValid(colors.yellow('--option'))
      this.renderUsageUtils.printInvalid(
        colors.red('--option' + this.system.booleanNotSyntaxEnding)
      )
    }

    if (this.system.allowDuplicateFlagForPrimitive) {
      this.renderUsageUtils.printGroupHeader(
        'Duplicate flags for primitive is enabled'
      )
      this.renderUsageUtils.printValid(
        colors.yellow('--option'),
        colors.dim('value1')
      )
      this.renderUsageUtils.printValid(
        colors.yellow('--option'),
        colors.dim('value1'),
        colors.yellow('--option'),
        'value2'
      )
    } else {
      this.renderUsageUtils.printGroupHeader(
        'Duplicate flags for primitive is disabled'
      )
      this.renderUsageUtils.printValid(colors.yellow('--option'), 'value')
      this.renderUsageUtils.printInvalid(
        colors.yellow('--option'),
        'value1',
        colors.yellow('--option'),
        'value2'
      )
    }

    if (this.system.allowDuplicateFlagForList) {
      this.renderUsageUtils.printGroupHeader(
        'Duplicate flags for list is enabled'
      )
      this.renderUsageUtils.printValid(
        colors.yellow('--option'),
        'value1 value2',
        colors.yellow('--option'),
        'value3'
      )
      this.renderUsageUtils.printValid(
        colors.yellow('--option'),
        'value1',
        colors.yellow('--option'),
        'value2 value3'
      )

      if (this.system.overwriteDuplicateFlagForList) {
        this.renderUsageUtils.printGroupHeader(
          'Overwrite duplicate flags for list is enabled'
        )

        this.renderUsageUtils.printValid(
          colors.yellow('--option'),
          colors.dim('value1'),
          colors.yellow('--option'),
          'value2 value3'
        )
        this.renderUsageUtils.printValid(
          colors.yellow('--option'),
          colors.dim('value1 value2'),
          colors.yellow('--option'),
          'value3'
        )
      } else {
        this.renderUsageUtils.printGroupHeader(
          'Overwrite duplicate flags for list is disabled'
        )

        this.renderUsageUtils.printValid(
          colors.yellow('--option'),
          'value1 value2 value3'
        )
        this.renderUsageUtils.printValid(
          colors.yellow('--option'),
          'value1',
          colors.yellow('--option'),
          'value2'
        )
      }
    } else {
      this.renderUsageUtils.printGroupHeader(
        'Duplicate flags for list is disabled'
      )

      this.renderUsageUtils.printValid(
        colors.yellow('--option'),
        'value1 value2 value3'
      )
      this.renderUsageUtils.printInvalid(
        colors.yellow('--option'),
        'value1',
        colors.yellow('--option'),
        'value2'
      )
    }
  }

  /**
   * Render the usage of the program
   *
   * @example
   *   program.renderUsage()
   */
  public renderUsage() {
    console.log(colors.bold(colors.cyan('📝 Structure:')))
    this.renderUsageStructure()
    console.log('')

    console.log(colors.bold(colors.cyan('📝 How to use flags:')))
    this.renderUsageHowToUseOptions()
    console.log('')

    console.log(colors.bold(colors.cyan('📝 Program Configuration:')))
    this.renderUsageProgramConfiguration()
    console.log('')

    console.log(colors.bold(colors.cyan('📝 System Configuration:')))
    this.renderUsageSystemConfiguration()
    console.log('')
  }
}
