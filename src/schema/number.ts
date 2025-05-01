import { Prettify } from '../utils/utils.type'
import { TypeCore, TypeCoreConfig } from './core'
import { ResultErr, ResultOk } from './result'

export class TypeNumber<
  const TConfig extends TypeNumberConfig,
> extends TypeCore<TConfig> {
  name = 'number' as const

  protected checkType(value: string | number) {
    if (value === '') return new ResultErr(`Number can not be empty string`)

    const number = typeof value === 'string' ? Number(value) : value

    if (isNaN(number))
      return new ResultErr(`\`${value}\` is not a valid number`)

    if (this.config.min && number < this.config.min) {
      return new ResultErr(`Number must be at least ${this.config.min}`)
    }

    if (this.config.max && number > this.config.max) {
      return new ResultErr(`Number must be at most ${this.config.max}`)
    }

    if (
      this.config.enum &&
      this.config.enum.length &&
      !this.config.enum.includes(number)
    ) {
      return new ResultErr(`\`${number}\` is not in enum`)
    }

    return new ResultOk(this.config.toInteger ? Math.floor(number) : number)
  }

  public configure<const T extends Omit<NumberConfig, 'enum'>>(
    config: T
  ): TypeNumber<Prettify<TConfig & T>> {
    const newInstance = new TypeNumber({
      ...this.config,
      ...config,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return newInstance as any
  }
}

type NumberConfig = Partial<{
  min: number
  max: number
  toInteger: boolean

  enum: Array<number>
}>
export type TypeNumberConfig = TypeCoreConfig & NumberConfig
export type TypeNumberSample = TypeNumber<TypeNumberConfig>
