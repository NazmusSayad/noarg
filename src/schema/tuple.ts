import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeTupleSchemaOptions = TypeSchemaOptions<{
  minLength?: number
  maxLength?: number
}>

export class TypeTupleSchema implements TypeSchema<unknown[]> {
  public name = 'tuple' as const

  constructor(private options: TypeTupleSchemaOptions) {}

  public parse(value: unknown): unknown[] {
    if (!Array.isArray(value)) {
      throw new NoArgTypeError(`Expected array but received ${value}`)
    }

    return value as unknown[]
  }
}
