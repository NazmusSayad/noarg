import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeEnumSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypePrimitiveUnionSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import { ProgramParser } from './program-parser'

export type InternalOptionSchemaType =
  | TypePrimitiveUnionSchema
  | TypeBooleanSchema
  | TypeStringSchema
  | TypeNumberSchema
  | TypeEnumSchema
  | TypeNoValueSchema
  | TypeArraySchema
  | TypeTupleSchema

export type InternalOptionSchemaResultType =
  | (string | boolean | number)
  | (string | boolean | number)[]

export type InternalArgumentSchemaType =
  | TypePrimitiveUnionSchema
  | TypeBooleanSchema
  | TypeStringSchema
  | TypeNumberSchema
  | TypeEnumSchema

export type InternalProgramParserArgumentEntry = {
  name: string
  type: InternalArgumentSchemaType

  defaultValue?: unknown
  description?: string
  askQuestion?: string
}

export type InternalProgramParserOptionalArgumentEntry = {
  name: string
  type: InternalArgumentSchemaType

  description?: string
}

export type InternalProgramParserListArgumentEntry = {
  name: string
  type: InternalArgumentSchemaType

  description?: string
  minLength?: number
  maxLength?: number
}

export type InternalProgramParserOptionEntry = {
  name: string
  type: InternalOptionSchemaType
  aliases: string[]

  required?: boolean
  askQuestion?: string
  defaultValue?: unknown

  global?: boolean
  description?: string
}

export type InternalProgramParserOptions = {
  id: string
  command: string
  description: string | undefined

  subPrograms: ProgramParser[]
  primaryArguments: InternalProgramParserArgumentEntry[]
  optionalArguments: InternalProgramParserOptionalArgumentEntry[]
  listArguments: InternalProgramParserListArgumentEntry | null
  options: InternalProgramParserOptionEntry[]

  config: {
    trailingArguments?: boolean
    doNotSplitArgumentsByComma?: boolean
  }
}

export type InternalProgramParserResult = {
  primaryArguments: string[]
  optionalArguments: string[]
  listArguments: string[]
  options: Record<string, unknown>
}
