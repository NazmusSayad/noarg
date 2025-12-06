import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema } from './interface'

export class TypeTupleSchema implements TypeSchema<unknown[]> {
  constructor() {}

  public parse(value: unknown): unknown[] {
    if (!Array.isArray(value)) {
      throw new NoArgTypeError(`Expected array but received ${value}`)
    }

    return value as unknown[]
  }
}
