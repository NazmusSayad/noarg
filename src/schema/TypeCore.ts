import { Prettify } from '../types/util.t'
import { ResultErr, ResultOk } from './result'
import verifyOptionName from '../helpers/verify-flag-name'
import { ParsedResult, ExtractTypeOutput, InferAndUpdateConfig } from './type.t'

export type TypeCoreConfig = Partial<{
  aliases: string[]
  description: string
  required: boolean
  default: any
  ask: string
}>

export default class TypeCore<TConfig extends TypeCoreConfig> {
  name = 'core'
  constructor(public config: TConfig) {}

  parse<SELF = typeof this>(
    value?: string | string[]
  ): ParsedResult<ExtractTypeOutput<SELF>, string> {
    const result = this.checkType(value)
    if (result instanceof ResultErr) {
      return { value: null, error: result.message, valid: false }
    }
    return { value: result.value, error: null, valid: true }
  }

  checkType(_: unknown): ResultOk | ResultErr {
    return new ResultErr("This type doesn't have a checkType method")
  }

  default<TDefault extends ExtractTypeOutput<SELF>, SELF = typeof this>(
    value: TDefault
  ): InferAndUpdateConfig<SELF, Prettify<TConfig & { default: TDefault }>> {
    this.config.default = value
    return this as any
  }

  ask<TDefault extends string, SELF = typeof this>(
    question?: TDefault
  ): InferAndUpdateConfig<SELF, Prettify<TConfig & { ask: TDefault }>> {
    this.config.ask = question ?? 'Enter a value:'
    return this as any
  }

  aliases<TAliases extends string[], SELF = typeof this>(
    ...aliases: TAliases
  ): InferAndUpdateConfig<SELF, Prettify<TConfig & { aliases: TAliases }>> {
    aliases.forEach((alias) => {
      verifyOptionName('Alias', alias)
    })

    this.config.aliases = [...new Set(aliases)].sort(
      (a, b) => a.length - b.length
    )

    return this as any
  }

  required<SELF = typeof this>(): InferAndUpdateConfig<
    SELF,
    Prettify<TConfig & { required: true }>
  > {
    this.config.required = true
    return this as any
  }

  optional<SELF = typeof this>(): InferAndUpdateConfig<
    SELF,
    Prettify<TConfig & { required: false }>
  > {
    this.config.required = false
    return this as any
  }

  description<TDescription extends string, SELF = typeof this>(
    description: TDescription
  ): InferAndUpdateConfig<
    SELF,
    Prettify<TConfig & { description: TDescription }>
  > {
    this.config.description = description
    return this as any
  }
}