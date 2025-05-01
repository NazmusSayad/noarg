import { TSchemaPrimitive } from '.'
import { Prettify } from '../utils/utils.type'
import { TypeCore, TypeCoreConfig } from './core'
import { ResultErr, ResultOk } from './result'
import { TypeStringSample } from './string'

export class TypeArray<
  const TConfig extends TypeArrayConfig,
> extends TypeCore<TConfig> {
  name = 'array' as const

  protected checkType(value: string[]) {
    if (!Array.isArray(value)) {
      return new ResultErr('Expected an array of ' + this.config.schema.name)
    }
    if (this.config.minLength && value.length < this.config.minLength) {
      return new ResultErr(`Minimum ${this.config.minLength} items expected`)
    }
    if (this.config.maxLength && value.length > this.config.maxLength) {
      return new ResultErr(`Maximum ${this.config.maxLength} items expected`)
    }

    const result = value.map((item) => {
      const schema = this.config.schema as TypeStringSample
      return schema['checkType'](item)
    })

    for (const item of result) {
      if (item instanceof ResultErr) return item
    }

    return new ResultOk((result as ResultOk[]).map((item) => item.value))
  }

  /** Sets the minimum length constraint for the array. */
  minLength<TMinLength extends number>(
    minLength: TMinLength
  ): TypeArray<Prettify<TConfig & { minLength: TMinLength }>> {
    this.config.minLength = minLength

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }

  /** Sets the maximum length constraint for the array. */
  maxLength<TMaxLength extends number>(
    maxLength: TMaxLength
  ): TypeArray<Prettify<TConfig & { maxLength: TMaxLength }>> {
    this.config.maxLength = maxLength

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any
  }
}

export type TypeArrayConfig = TypeCoreConfig &
  Partial<{
    minLength: number
    maxLength: number
  }> & { schema: TSchemaPrimitive }

export type TypeArraySample = TypeArray<TypeArrayConfig>
