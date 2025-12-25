export class NoArgClientError extends Error {
	constructor(message: string) {
		super(message)
	}
}

export class NoArgSyntaxError extends NoArgClientError {
	constructor(message: string) {
		super(`Syntax error: ${message}`)
	}
}

export class NoArgTypeError extends NoArgClientError {
	constructor(message: string) {
		super(`Validation error: ${message}`)
	}
}

export class NoArgNodeError extends NoArgClientError {
	constructor(
		public index: number,
		message: string
	) {
		super(message)
	}
}
