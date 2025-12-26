import { NoArgTypeError } from '@/helpers/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeEnumSchemaOptions = TypeSchemaOptions<{
  values: string[]
}>

export class TypeEnumSchema<
  const T extends TypeEnumSchemaOptions = TypeEnumSchemaOptions,
> implements TypeSchema<string | number | boolean> {
  public name = 'enum' as const

  constructor(private options: T) {}

  public parse(value: unknown): string {
    if (this.options.values.some((v) => v === value)) {
      return value as string
    }

    throw new NoArgTypeError(
      `Expected one of ${this.options.values.join(', ')} but received ${value}`
    )
  }
}
