export class NoArgValidationError extends Error {
  constructor(
    public id: string,
    message: string
  ) {
    super(message)
  }
}

export class NoArgDuplicateFlagError extends NoArgValidationError {
  constructor(id: string, flag: string) {
    super(id, `Flag ${flag} is already defined`)
  }
}

export class NoArgUnknownFlagError extends NoArgValidationError {
  constructor(id: string, flag: string) {
    super(id, `Flag ${flag} is unknown`)
  }
}

export class NoArgDuplicateFlagForListError extends NoArgValidationError {
  constructor(id: string, flag: string) {
    super(id, `Flag ${flag} is already defined for list`)
  }
}

export class NoArgDuplicateFlagForPrimitiveError extends NoArgValidationError {
  constructor(id: string, flag: string) {
    super(id, `Flag ${flag} is already defined for primitive`)
  }
}

export class NoArgSyntaxError extends Error {
  constructor(message: string) {
    super(`Syntax error: ${message}`)
  }
}
