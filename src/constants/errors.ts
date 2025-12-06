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
    public id: string,
    message: string
  ) {
    super(message)
  }
}

export class NoArgUnknownOptionError extends NoArgNodeError {
  constructor(id: string, option: string) {
    super(id, `Option ${option} is unknown`)
  }
}

export class NoArgEmptyOptionValueError extends NoArgNodeError {
  constructor(id: string, option: string) {
    super(id, `Expected option value bug received option ${option}`)
  }
}
