import { InternalArgumentSchemaType, InternalOptionSchemaType } from '@/parser'
import { Prettify } from '@/utils/utils.type'
import { ExtractProgramResult } from './extract.type'
import { ProgramArgument, ProgramOption } from './program'

export type ProgramConfig = {
  name: string
  description?: string

  options?: ProgramOption<ProgramOptionConfig>[]
  arguments?: ProgramArgument<ProgramArgumentConfig>[]
  optionalArguments?: ProgramArgument<ProgramArgumentConfig>[]
  additionalArguments?: ProgramArgument<ProgramArgumentConfig>
}

export type ProgramRootConfig = ProgramConfig & {
  trailingArguments?: boolean
  doNotSplitArgumentsByComma?: boolean
}

export type ProgramHandler<T extends ProgramConfig> = (
  result: Prettify<ExtractProgramResult<T>>
) => void

export type ProgramOptionOptions = {
  global?: boolean
  optional?: boolean
  aliases?: string[]

  description?: string
  askQuestion?: string
}

export type ProgramOptionConfig = {
  name: string
  type: InternalOptionSchemaType
} & ProgramOptionOptions

export type ProgramArgumentOptions = {
  description?: string
}

export type ProgramArgumentConfig = {
  name: string
  type: InternalArgumentSchemaType
} & ProgramArgumentOptions
