export class NoArgInternalError extends Error {
  constructor(message: string) {
    super(message)
  }
}

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

export class NoArgNodeError extends NoArgClientError {
  constructor(
    public index: number,
    message: string
  ) {
    super(message)
  }
}

export class NoArgUnknownOptionError extends NoArgNodeError {
  constructor(index: number, option: string) {
    super(index, `Option ${option} is unknown`)
  }
}

export class NoArgEmptyOptionValueError extends NoArgNodeError {
  constructor(index: number, option: string) {
    super(index, `Expected option value but received option ${option}`)
  }
}
