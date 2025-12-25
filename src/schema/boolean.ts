import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeBooleanSchemaOptions = TypeSchemaOptions<{
	_?: never
}>

export class TypeBooleanSchema<
	const T extends TypeBooleanSchemaOptions = TypeBooleanSchemaOptions,
> implements TypeSchema<boolean>
{
	public name = 'boolean' as const

	constructor(private options: T) {}

	public static parseStringToBoolean(value: unknown): boolean | null {
		if (value === 'true' || value === 'yes') {
			return true
		}

		if (value === 'false' || value === 'no') {
			return false
		}

		return null
	}

	public parse(value: unknown) {
		const output = TypeBooleanSchema.parseStringToBoolean(value)
		if (output !== null) {
			return output
		}

		throw new NoArgTypeError(`Expected boolean but received ${value}`)
	}
}
