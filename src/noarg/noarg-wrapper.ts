import {
  PartialProgramConfig,
  ResolvedProgramConfig,
} from '@/types/config.type'
import {
  PartialProgramOptions,
  ResolvedProgramOptions,
} from '@/types/options.type'
import { ProgramHandler } from '@/types/parser.type'
import { NoArgProgram } from './noarg-program'

export class NoArgWrapper<
  TOptions extends PartialProgramOptions,
  TConfig extends PartialProgramConfig,
> extends NoArgProgram<
  ResolvedProgramOptions & TOptions,
  ResolvedProgramConfig & TConfig
> {
  constructor(
    options: TOptions,
    config: TConfig,
    handler: ProgramHandler<ResolvedProgramOptions, ResolvedProgramConfig>,
    parent?: NoArgProgram<ResolvedProgramOptions, ResolvedProgramConfig>
  ) {
    super(
      {
        ...options,

        args: [],
        flags: {},
        optArgs: [],

        notes: [],
        trailingArgs: '--',

        ...options,
      },

      {
        help: true,
        skipGlobalFlags: false,

        skipUnknownFlag: false,
        allowEqualAssign: false,
        allowMultipleValuesForPrimitive: true,

        splitListByComma: false,
        allowDuplicateFlagForList: true,
        allowDuplicateFlagForPrimitive: false,
        overwriteDuplicateFlagForList: false,

        booleanNotSyntaxEnding: '!',
        enableHelpBoxBorder: false,

        doNotExitOnError: true,
        ...config,
      },

      handler,

      parent
    )
  }

  public addProgram(
    program: NoArgWrapper<PartialProgramOptions, PartialProgramConfig>
  ) {
    if (this.programs.has(program.getName())) {
      throw new Error(
        `Program with name "${program.getName()}" already exists.`
      )
    }

    this.programs.set(program.getName(), program)
  }

  public getOptions() {
    return { ...this.options }
  }

  public getConfig() {
    return { ...this.config }
  }

  public start(args: string[]) {
    console.log('Starting application with args:', args)
  }
}
