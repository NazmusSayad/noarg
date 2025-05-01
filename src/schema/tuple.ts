import { TSchemaPrimitive } from '.'
import { TypeCore, TypeCoreConfig } from './core'
import { ResultErr, ResultOk } from './result'
import { TypeStringSample } from './string'

export class TypeTuple<
  const TConfig extends TypeTupleConfig,
> extends TypeCore<TConfig> {
  name = 'tuple' as const

  protected checkType(value: string[]) {
    if (!Array.isArray(value)) {
      return new ResultErr('Expected a tuple')
    }

    if (value.length !== this.config.schema.length) {
      return new ResultErr(`Expected ${this.config.schema.length} items`)
    }

    const result = value.map((item, i) => {
      const schema = this.config.schema[i] as TypeStringSample
      return schema['checkType'](item)
    })

    for (const item of result) {
      if (item instanceof ResultErr) return item
    }

    return new ResultOk((result as ResultOk[]).map((item) => item.value))
  }
}

export type TypeTupleConfig = TypeCoreConfig & { schema: TSchemaPrimitive[] }
export type TypeTupleSample = TypeTuple<TypeTupleConfig>
