export class NoArgInternalError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class NoArgUnexpectedError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class NoArgSyntaxError extends NoArgUnexpectedError {
  constructor(message: string) {
    super(`Syntax error: ${message}`)
  }
}

export class NoArgValidationError extends Error {
  constructor(
    public id: string,
    message: string
  ) {
    super(message)
  }
}

export class NoArgUnknownFlagError extends NoArgValidationError {
  constructor(id: string, flag: string) {
    super(id, `Flag ${flag} is unknown`)
  }
}

export class NoArgExpectedOptionValueError extends NoArgValidationError {
  constructor(id: string, flag: string) {
    super(id, `Expected option value bug received option ${flag}`)
  }
}
