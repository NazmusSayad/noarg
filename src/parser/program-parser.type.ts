import { TypeSchemaBase } from '@/schema/base'

export type InternalProgramParserArgumentEntry = {
  name: string
  type: TypeSchemaBase

  defaultValue?: unknown
  description?: string
  askQuestion?: string
}

export type InternalProgramParserOptionalArgumentEntry = {
  name: string
  type: TypeSchemaBase

  description?: string
}

export type InternalProgramParserListArgumentEntry = {
  name: string
  type: TypeSchemaBase

  description?: string
  minLength?: number
  maxLength?: number
}

export type InternalProgramParserFlagEntry = {
  name: string
  type: TypeSchemaBase

  global?: boolean
  description?: string
  askQuestion?: string
  defaultValue?: unknown
}

export type InternalProgramParserOptions = {
  name: string
  description: string | undefined
  trailingArguments: boolean

  subPrograms: InternalProgramParserOptions[]
  primaryArguments: InternalProgramParserArgumentEntry[]
  optionalArguments: InternalProgramParserOptionalArgumentEntry[]
  listArguments: InternalProgramParserListArgumentEntry[]
  flags: InternalProgramParserFlagEntry[]
}
