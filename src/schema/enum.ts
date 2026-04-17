import { NoArgTypeError } from '@/helpers/errors'
import { TypeSchema, TypeSchemaOptions } from './schema.interface'

export type TypeEnumSchemaOptions = TypeSchemaOptions<{
  values: string[]
}>

export class TypeEnumSchema<
  const T extends TypeEnumSchemaOptions = TypeEnumSchemaOptions,
> implements TypeSchema<string | number | boolean> {
  public name = 'enum' as const

  constructor(private options: T) {}

  public parse(value: unknown): string {
    const matchedValue = this.options.values.find(
      (v: unknown) =>
        v === value ||
        v === String(value) ||
        v === Number(value) ||
        v === Boolean(value)
    )

    if (matchedValue !== undefined) {
      return matchedValue
    }

    throw new NoArgTypeError(
      `Expected one of ${this.options.values.join(', ')} but received ${value}`
    )
  }
}
