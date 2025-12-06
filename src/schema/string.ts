import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema } from './interface'

export type TypeStringSchemaOptions = {
  minLength?: number
  maxLength?: number
}

export class TypeStringSchema implements TypeSchema<string> {
  constructor(private options: TypeStringSchemaOptions) {}

  public parse(value: unknown): string {
    if (typeof value !== 'string') {
      throw new NoArgTypeError(`Expected string but received ${value}`)
    }

    if (
      this.options.minLength !== undefined &&
      value.length < this.options.minLength
    ) {
      throw new NoArgTypeError(
        `Expected string to be at least ${this.options.minLength} characters long`
      )
    }

    if (
      this.options.maxLength !== undefined &&
      value.length > this.options.maxLength
    ) {
      throw new NoArgTypeError(
        `Expected string to be at most ${this.options.maxLength} characters long`
      )
    }

    return value
  }
}
