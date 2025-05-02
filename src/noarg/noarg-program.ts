import {
  ProgramHandler,
  ProgramOptions,
  RequiredProgramOptions,
  RequiredSystemConfig,
  SystemConfig,
} from '@/types'
import { NoArgCore } from './noarg-core'

export class NoArgProgram<
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> extends NoArgCore<
  RequiredProgramOptions & TOptions,
  RequiredSystemConfig & TConfig
> {
  protected handler

  constructor(
    options: TOptions,
    config: TConfig,
    handler?: ProgramHandler<RequiredProgramOptions, RequiredSystemConfig>
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
    handler: ProgramHandler<RequiredProgramOptions, RequiredSystemConfig>
  ) {
    this.handler = handler
  }

  public setProgram(
    program: NoArgProgram<RequiredProgramOptions, RequiredSystemConfig>
  ) {
    this.programs.set(program.getName(), program)
  }

  public hasProgram(name: string) {
    return this.programs.has(name)
  }

  public run(args: string[]) {
    console.log(args)
  }
}
