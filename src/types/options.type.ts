import { MergeObject, Prettify } from '@/utils/utils.type'

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

export type ProgramFlagOptions = Partial<{
  global: boolean
  description: string
  askQuestion: string
  defaultValue: string | boolean
}>

export type ProgramOptions = {
  name: string
  description?: string

  notes?: string[]

  flags?: Record<string, ProgramFlagOptions>

  args?: ProgramArgConfig[]
  optArgs?: ProgramArgConfig[]
  listArg?: ProgramListArgConfig

  trailingArgs?: string | false

  helpUsageStructure?: string
  helpUsageTrailingArgsLabel?: string
}

export type RequiredProgramOptions = Prettify<
  MergeObject<
    Required<ProgramOptions>,
    Pick<
      ProgramOptions,
      'listArg' | 'helpUsageStructure' | 'helpUsageTrailingArgsLabel'
    >
  >
>
