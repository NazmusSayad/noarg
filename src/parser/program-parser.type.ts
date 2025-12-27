/* eslint-disable @typescript-eslint/no-explicit-any */

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

type InternalPrimitiveSchemaType =
  | TypeStringSchema<any>
  | TypeNumberSchema<any>
  | TypeBooleanSchema<any>
  | TypeEnumSchema<any>
  | TypePrimitiveUnionSchema<any>

type InternalCompositeSchemaType = TypeArraySchema<any> | TypeTupleSchema<any>

export type InternalSchemaType =
  | InternalPrimitiveSchemaType
  | InternalCompositeSchemaType
  | TypeNoValueSchema<any>

export type InternalOptionSchemaType =
  | TypeNoValueSchema<any>
  | InternalPrimitiveSchemaType
  | InternalCompositeSchemaType

export type InternalArgumentSchemaType = InternalPrimitiveSchemaType

export type InternalOptionSchemaResultType =
  | (string | boolean | number)
  | (string | boolean | number)[]

export type InternalArgumentSchemaResultType = string | boolean | number

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
  description?: string

  askQuestion?: string
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
  options: Record<string, InternalOptionSchemaResultType>
  primaryArguments: Record<string, InternalArgumentSchemaResultType>
  optionalArguments: Partial<Record<string, InternalArgumentSchemaResultType>>
  listArguments: InternalArgumentSchemaResultType[]
}
