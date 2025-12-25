import { NoArgTypeError } from '@/lib/errors'
import { TypeSchema, TypeSchemaOptions } from './interface'

export type TypeNumberSchemaOptions = TypeSchemaOptions<{
	min?: number
	max?: number
}>

export class TypeNumberSchema<
	const T extends TypeNumberSchemaOptions = TypeNumberSchemaOptions,
> implements TypeSchema<number>
{
	public name = 'number' as const

	constructor(private options: T) {}

	public static isValidNumber(value: unknown): value is number {
		return (
			typeof value === 'number' &&
			Number.isFinite(value) &&
			!Number.isNaN(value)
		)
	}

	private parseNumberCore(value: unknown) {
		if (TypeNumberSchema.isValidNumber(value)) {
			return value
		}

		const number = Number(value)
		if (TypeNumberSchema.isValidNumber(number)) {
			return number
		}

		throw new NoArgTypeError(`Expected number but received ${value}`)
	}

	public parse(value: unknown) {
		const number = this.parseNumberCore(value)

		if (this.options.min !== undefined && number < this.options.min) {
			throw new NoArgTypeError(
				`Expected number to be greater than ${this.options.min}`
			)
		}

		if (this.options.max !== undefined && number > this.options.max) {
			throw new NoArgTypeError(
				`Expected number to be less than ${this.options.max}`
			)
		}

		return number
	}
}
