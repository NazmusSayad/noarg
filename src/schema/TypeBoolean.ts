import { TypeCore } from './TypeCore'
import { ResultErr, ResultOk } from './result'

export class TypeBoolean<
  const TConfig extends TypeBoolean.Config
> extends TypeCore<TConfig> {
  name = 'boolean' as const

  protected checkType(value: string) {
    value = value.trim().toLowerCase()

    if (value === 'true' || value === 'yes') return new ResultOk(true)
    if (value === 'false' || value === 'no') return new ResultOk(false)
    return new ResultErr(`\`${value}\` is not a valid boolean`)
  }
}

export namespace TypeBoolean {
  export type Config = TypeCore.Config & Partial<{}>
  export type Sample = TypeBoolean<Config>
}
