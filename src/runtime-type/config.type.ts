import { TupleConstructor } from './tuple'

export type SimpleStringConfig = {
  typeV2: StringConstructor

  regex?: RegExp
  enum?: Array<string>
  toCase?: 'lower' | 'upper'

  minLength?: number
  maxLength?: number
}

export type SimpleNumberConfig = {
  typeV2: NumberConstructor

  min?: number
  max?: number
  toInteger?: boolean

  enum?: Array<number>
}

export type SimpleBooleanConfig = {
  typeV2: BooleanConstructor
}

export type SimpleArrayConfig = {
  typeV2: PrimitiveTypeConfigs[]

  minLength?: number
  maxLength?: number
}

export type SimpleTupleConfig = {
  typeV2: TupleConstructor<PrimitiveTypeConfigs[]>
}

export type PrimitiveTypeConfigs =
  | SimpleStringConfig
  | SimpleNumberConfig
  | SimpleBooleanConfig

export type AllTypeConfigs =
  | PrimitiveTypeConfigs
  | SimpleArrayConfig
  | SimpleTupleConfig
