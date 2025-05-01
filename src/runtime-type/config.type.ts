import { TupleConstructor } from './data-types'

export type SimpleStringConfig = {
  type: StringConstructor

  regex?: RegExp
  enum?: Array<string>
  toCase?: 'lower' | 'upper'

  minLength?: number
  maxLength?: number
}

export type SimpleNumberConfig = {
  type: NumberConstructor

  min?: number
  max?: number
  toInteger?: boolean

  enum?: Array<number>
}

export type SimpleBooleanConfig = {
  type: BooleanConstructor
}

export type SimpleArrayConfig = {
  type: PrimitiveTypeConfigs[]

  minLength?: number
  maxLength?: number
}

export type SimpleTupleConfig = {
  type: TupleConstructor<PrimitiveTypeConfigs[]>
}

export type PrimitiveTypeConfigs =
  | SimpleStringConfig
  | SimpleNumberConfig
  | SimpleBooleanConfig

export type AllTypeConfigs =
  | SimpleStringConfig
  | SimpleNumberConfig
  | SimpleBooleanConfig
  | SimpleArrayConfig
  | SimpleTupleConfig
