import { NoArgUnexpectedError } from '@/helpers/errors'
import { TypeSchema, TypeSchemaOptions } from './schema.interface'

export type TypeNoValueSchemaOptions = TypeSchemaOptions<{}>

export class TypeNoValueSchema<
  const T extends TypeNoValueSchemaOptions = TypeNoValueSchemaOptions,
> implements TypeSchema<void> {
  public name = 'no-value' as const

  constructor(private options: T) {}

  public parse(_value: unknown): void {
    throw new NoArgUnexpectedError(`This schema should not be used`)
  }
}
