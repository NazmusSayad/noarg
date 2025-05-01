import {
  defaultConfig,
  defaultOptions,
  defaultSystemConfig,
} from '../constants/config'
import { NoArgProgram } from '../no-arg/program'
import {
  SimpleBooleanConfig,
  SimpleNumberConfig,
  SimpleStringConfig,
} from '../runtime-type'
import { TSchema, TSchemaPrimitive } from '../schema'

export type BaseArgOption = {
  name: string
  type: TSchemaPrimitive
  description?: string
} & (SimpleStringConfig | SimpleNumberConfig | SimpleBooleanConfig)

export type ArgOption = BaseArgOption & {
  askQuestion?: string
}

export type OptionalArgOption = BaseArgOption & {}

export type ListArgOption = BaseArgOption & {
  minLength?: number
  maxLength?: number
}

export type FlagOption = Record<string, TSchema>

export type NoArgProgramMap = Map<
  string,
  NoArgProgram<string, RootSystemConfig, BaseConfig, ProgramOptions>
>

export type BaseConfig = {
  readonly help: boolean
}

export type ProgramConfig = BaseConfig & {
  readonly skipGlobalFlags?: boolean
}

export type ProgramOptions = {
  readonly notes?: string[]
  readonly description?: string

  readonly requiredArgs: ArgOption[]
  readonly optionalArgs: OptionalArgOption[]

  readonly listArg?: ListArgOption
  readonly trailingArgs?: string

  readonly flags: FlagOption
  readonly globalFlags: FlagOption

  readonly customRenderHelp?: {
    helpUsageStructure?: string
    helpUsageTrailingArgsLabel?: string
  }
}

export type RootSystemConfig = {
  readonly skipUnknownFlag?: boolean
  readonly allowEqualAssign: boolean
  readonly allowMultipleValuesForPrimitive?: boolean

  readonly splitListByComma?: boolean
  readonly allowDuplicateFlagForPrimitive?: boolean
  readonly allowDuplicateFlagForList: boolean
  readonly overwriteDuplicateFlagForList?: boolean

  readonly booleanNotSyntaxEnding: string | false
  readonly enableHelpBoxBorder?: boolean

  readonly doNotExitOnError?: boolean
}

export type DefaultConfig = typeof defaultConfig
export type DefaultSystem = typeof defaultSystemConfig
export type DefaultOptions = typeof defaultOptions
