export type SystemConfig = Partial<{
  help: boolean
  skipGlobalFlags: boolean

  skipUnknownFlag: boolean
  allowEqualAssign: boolean
  allowMultipleValuesForPrimitive: boolean

  splitListByComma: boolean
  allowDuplicateFlagForList: boolean
  allowDuplicateFlagForPrimitive: boolean
  overwriteDuplicateFlagForList: boolean

  booleanNotSyntaxEnding: string
  enableHelpBoxBorder: boolean

  doNotExitOnError: boolean
}>

export type ProgramConfig = Pick<SystemConfig, 'help'>

export type ResolvedSystemConfig = Required<SystemConfig>
