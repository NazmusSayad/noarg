import { TypeCore, TypeCoreConfig } from './core'
import { ResultErr, ResultOk } from './result'

export class TypeBoolean<
  const TConfig extends TypeBooleanConfig,
> extends TypeCore<TConfig> {
  name = 'boolean' as const

  protected checkType(value: string) {
    value = value.trim().toLowerCase()

    if (value === 'true' || value === 'yes') return new ResultOk(true)
    if (value === 'false' || value === 'no') return new ResultOk(false)
    return new ResultErr(`\`${value}\` is not a valid boolean`)
  }
}

export type TypeBooleanConfig = TypeCoreConfig & Partial<object>
export type TypeBooleanSample = TypeBoolean<TypeBooleanConfig>
