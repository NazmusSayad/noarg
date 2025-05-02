import {
  ProgramHandler,
  ProgramOptions,
  ResolvedProgramOptions,
  ResolvedSystemConfig,
  SystemConfig,
} from '@/types'
import { NoArgCore } from './noarg-core'

export class NoArgProgram<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> extends NoArgCore<
  ResolvedProgramOptions & TOptions,
  ResolvedSystemConfig & TConfig
> {
  protected handler

  constructor(
    options: TOptions,
    config: TConfig,
    handler?: ProgramHandler<ResolvedProgramOptions, ResolvedSystemConfig>
  ) {
    super(
      {
        flags: {},

        args: [],
        optArgs: [],

        listArg: '',
        trailingArgs: '',

        notes: [],

        helpUsageStructure: '',
        helpUsageTrailingArgsLabel: '',

        description: '',

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
      }
    )

    this.handler = handler
  }

  public getConfig() {
    return Object.freeze(this.config)
  }

  public setHandler(
    handler: ProgramHandler<ResolvedProgramOptions, ResolvedSystemConfig>
  ) {
    this.handler = handler
  }

  public setProgram(
    program: NoArgProgram<ResolvedProgramOptions, ResolvedSystemConfig>
  ) {
    this.programs.set(program.getName(), program)
  }

  public hasProgram(name: string) {
    return this.programs.has(name)
  }
}
