import { NoArgInternalError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeNoValueSchemaOptions = TypeSchemaOptions<{}>

export class TypeNoValueSchema implements TypeSchema<void> {
  public name = 'no-value' as const

  constructor(private options: TypeNoValueSchemaOptions) {}

  public parse(_value: unknown): void {
    throw new NoArgInternalError(`This schema should not be used`)
  }
}
