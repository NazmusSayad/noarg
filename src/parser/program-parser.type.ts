import {
  PrimitiveUnionSchema,
  TypeArraySchema,
  TypeBooleanSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import { ProgramParser } from './program-parser'

export type InternalOptionSchemaType =
  | PrimitiveUnionSchema
  | TypeNoValueSchema
  | TypeBooleanSchema
  | TypeStringSchema
  | TypeNumberSchema
  | TypeArraySchema
  | TypeTupleSchema

export type InternalOptionSchemaResultType =
  | (string | boolean | number)
  | (string | boolean | number)[]

export type InternalArgumentSchemaType =
  | TypeBooleanSchema
  | TypeStringSchema
  | TypeNumberSchema

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

  global?: boolean
  description?: string
  askQuestion?: string
  defaultValue?: unknown
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
    trailingArguments: boolean
  }
}

export type InternalProgramParserResult = {
  primaryArguments: string[]
  optionalArguments: string[]
  listArguments: string[]
  options: Record<string, unknown>
}
