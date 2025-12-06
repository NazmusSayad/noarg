import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeNumberSchemaOptions = TypeSchemaOptions<{
  min?: number
  max?: number
}>

export class TypeNumberSchema implements TypeSchema<number> {
  public name = 'number' as const

  constructor(private options: TypeNumberSchemaOptions) {}

  public parse(value: unknown): number {
    if (typeof value !== 'number') {
      throw new NoArgTypeError(`Expected number but received ${value}`)
    }

    return value
  }
}
