import { TypeArray, TypeArraySample } from './array'
import { TypeBoolean, TypeBooleanSample } from './boolean'
import { TypeCoreConfig } from './core'
import { TypeNumber, TypeNumberSample } from './number'
import { TypeString, TypeStringSample } from './string'
import { TypeTuple, TypeTupleSample } from './tuple'

export type CombineConfig<T, U> = T & {
  config: TypeCoreConfig & U
}

export type ParsedResult<T, U> =
  | { value: T; error: null; valid: true }
  | { value: null; error: U; valid: false }

export type TSchemaPrimitive =
  | TypeStringSample
  | TypeNumberSample
  | TypeBooleanSample

export type TSchemaList = TypeArraySample | TypeTupleSample

export type TSchema = TSchemaPrimitive | TSchemaList

export type InferAndUpdateConfig<T, NConf> =
  T extends TypeString<infer TConf> ?
    TypeString<NConf extends TConf ? NConf : never>
  : T extends TypeNumber<infer TConf> ?
    TypeNumber<NConf extends TConf ? NConf : never>
  : T extends TypeBoolean<infer TConf> ?
    TypeBoolean<NConf extends TConf ? NConf : never>
  : T extends TypeArray<infer TConf> ?
    TypeArray<NConf extends TConf ? NConf : never>
  : T extends TypeTuple<infer TConf> ?
    TypeTuple<NConf extends TConf ? NConf : never>
  : never

export type ExtractTypeTupleCore<T extends TSchemaPrimitive[]> = {
  [K in keyof T]: K extends `${number}` ?
    Exclude<ExtractTypeOutput<T[K]>, undefined>
  : T[K]
}

export type ExtractTypeOutput<T> =
  // Extract String
  T extends TypeString<infer Config> ?
    Config['enum'] extends Array<infer EnumStr> ?
      EnumStr
    : string
  : // Extract Number
  T extends TypeNumber<infer Config> ?
    Config['enum'] extends Array<infer EnumNum> ?
      EnumNum
    : number
  : // Extract Boolean
  T extends TypeBoolean<infer _Config> ? boolean
  : // Extract Array
  T extends TypeArray<infer Config> ?
    Config['schema'] extends TSchemaPrimitive ?
      Exclude<ExtractTypeOutput<Config['schema']>, undefined>[]
    : never
  : // Extract Tuple
  T extends TypeTuple<infer Config> ? ExtractTypeTupleCore<Config['schema']>
  : never
