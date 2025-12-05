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

export type InternalFlagSchemaType =
  | PrimitiveUnionSchema
  | TypeNoValueSchema
  | TypeBooleanSchema
  | TypeStringSchema
  | TypeNumberSchema
  | TypeArraySchema
  | TypeTupleSchema

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

export type InternalProgramParserFlagEntry = {
  name: string
  type: InternalFlagSchemaType
  aliases?: string[]

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
  flags: InternalProgramParserFlagEntry[]

  config: {
    trailingArguments: boolean
  }
}

export type InternalProgramParserResult = {
  primaryArguments: string[]
  optionalArguments: string[]
  listArguments: string[]
  flags: Record<string, unknown>
}
