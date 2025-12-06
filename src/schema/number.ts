import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema } from './interface'

export class TypeNumberSchema implements TypeSchema<number> {
  constructor() {}

  public parse(value: unknown): number {
    if (typeof value !== 'number') {
      throw new NoArgTypeError(`Expected number but received ${value}`)
    }

    return value
  }
}
