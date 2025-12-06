import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema } from './interface'

export class TypeBooleanSchema implements TypeSchema<boolean> {
  constructor() {}

  public parse(value: unknown): boolean {
    if (typeof value !== 'boolean') {
      throw new NoArgTypeError(`Expected boolean but received ${value}`)
    }

    return value
  }
}
