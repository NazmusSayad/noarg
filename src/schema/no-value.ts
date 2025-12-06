import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema } from './interface'

export class TypeNoValueSchema implements TypeSchema<void> {
  constructor() {}

  public parse(value: unknown): void {
    if (value !== undefined) {
      throw new NoArgTypeError(`Expected void but received ${value}`)
    }

    return value
  }
}
