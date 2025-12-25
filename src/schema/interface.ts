export interface TypeSchema<T> {
	name: string

	/**
	 * @param value - The value to parse, this should be string all the time
	 */
	parse(value: unknown): T
}

export type TypeSchemaOptions<T extends Record<string, unknown>> = T & {
	validate?: (value: unknown) => boolean
}
