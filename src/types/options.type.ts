import { AllTypeConfigs } from '@/runtime-type'

export type ProgramArgConfig = {
  name: string

  description?: string
  askQuestion?: string
  defaultValue?: string | boolean
}

export type ProgramOptionalArgConfig = {
  name: string

  description?: string
  askQuestion?: string
}

export type ProgramListArgConfig = {
  name: string

  description?: string
  minLength?: number
  maxLength?: number
}

export type ProgramFlagConfig = Record<
  string,
  {
    global?: boolean
    description?: string
    askQuestion?: string
    defaultValue?: string | boolean
  } & AllTypeConfigs
>

export type ProgramOptions = {
  notes: string[]
  description: string | null

  flags: ProgramFlagConfig

  args: ProgramArgConfig[]
  optionalArgs: ProgramArgConfig[]
  listArg: ProgramListArgConfig
  trailingArgs: string

  helpUsageStructure?: string
  helpUsageTrailingArgsLabel?: string
}
