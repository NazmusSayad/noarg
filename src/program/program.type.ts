import { InternalArgumentSchemaType, InternalOptionSchemaType } from '@/parser'
import { Prettify } from '@/utils/utils.type'
import { ProgramArgument } from './create-argument'
import { ProgramOption } from './create-option'
import { ExtractProgramResult } from './extract.type'

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
  required?: boolean
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
