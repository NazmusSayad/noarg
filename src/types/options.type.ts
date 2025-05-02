import { MergeObject, Prettify } from '@/utils/utils.type'

export type ProgramArgConfig = {
  name: string

  type: unknown
  defaultValue?: unknown

  description?: string
  askQuestion?: string
}

export type ProgramOptionalArgConfig = {
  name: string
  type: unknown

  description?: string
}

export type ProgramListArgConfig = {
  name: string
  description?: string

  type: unknown

  minLength?: number
  maxLength?: number
}

export type ProgramFlagOptions = {
  type: unknown
  defaultValue?: unknown

  global?: boolean
  description?: string
  askQuestion?: string
}

export type ProgramFlagsRecord = {
  [key: string]: ProgramFlagOptions
}

export type ProgramOptions = {
  name: string
  description?: string

  notes?: string[]

  args?: ProgramArgConfig[]
  optArgs?: ProgramArgConfig[]
  listArg?: ProgramListArgConfig
  flags?: ProgramFlagsRecord

  trailingArgs?: string | false

  helpUsageStructure?: string
  helpUsageTrailingArgsLabel?: string
}

export type ResolvedProgramOptions = Prettify<
  MergeObject<
    Required<ProgramOptions>,
    Pick<
      ProgramOptions,
      | 'description'
      | 'listArg'
      | 'helpUsageStructure'
      | 'helpUsageTrailingArgsLabel'
    >
  >
>
