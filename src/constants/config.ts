import { BaseConfig, ProgramOptions, RootSystemConfig } from '../types'

export const defaultConfig = {
  help: true,
} as const

export const defaultOptions = {
  requiredArgs: [] as [],
  optionalArgs: [] as [],
  flags: {},
  globalFlags: {},
} as const

export const defaultSystemConfig = {
  allowEqualAssign: true,
  allowDuplicateFlagForList: true,
  booleanNotSyntaxEnding: '!',
} as const

defaultConfig satisfies BaseConfig
defaultOptions satisfies ProgramOptions
defaultSystemConfig satisfies RootSystemConfig
