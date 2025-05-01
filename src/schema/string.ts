import { Prettify } from '../utils/utils.type'
import { TypeCore, TypeCoreConfig } from './core'
import { ResultErr, ResultOk } from './result'

export class TypeString<
  const TConfig extends TypeStringConfig,
> extends TypeCore<TConfig> {
  name = 'string' as const

  protected checkType(value: string) {
    if (this.config.regex && !this.config.regex.test(value)) {
      return new ResultErr(
        `\`${value}\` doesn't match pattern ${this.config.regex}`
      )
    }

    if (this.config.minLength && value.length < this.config.minLength) {
      return new ResultErr(
        `Minimum ${this.config.minLength} characters expected`
      )
    }

    if (this.config.maxLength && value.length > this.config.maxLength) {
      return new ResultErr(
        `Maximum ${this.config.maxLength} characters expected`
      )
    }

    if (this.config.toCase === 'lower') value = value.toLowerCase()
    if (this.config.toCase === 'upper') value = value.toUpperCase()

    if (
      this.config.enum &&
      this.config.enum.length &&
      !this.config.enum.includes(value)
    ) {
      return new ResultErr(`\`${value}\` is not in enum`)
    }

    return new ResultOk(value)
  }

  public configure<const T extends Omit<StringConfig, 'enum'>>(
    config: T
  ): TypeString<Prettify<TConfig & T>> {
    const newInstance = new TypeString({
      ...this.config,
      ...config,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return newInstance as any
  }
}

type StringConfig = Partial<{
  regex: RegExp
  minLength: number
  maxLength: number
  toCase: 'lower' | 'upper'
  enum: Array<string>
}>
export type TypeStringConfig = TypeCoreConfig & StringConfig
export type TypeStringSample = TypeString<TypeStringConfig>
