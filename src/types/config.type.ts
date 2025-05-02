export type PartialProgramConfig = Partial<{
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

export type ResolvedProgramConfig = Required<PartialProgramConfig>

export type PartialSubProgramConfig = Pick<
  PartialProgramConfig,
  'help' | 'skipGlobalFlags'
>
