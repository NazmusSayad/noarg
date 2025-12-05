export class NoArgDuplicateFlagError extends Error {
  constructor(flag: string) {
    super(`Flag ${flag} is already defined`)
  }
}

export class NoArgDuplicateFlagForListError extends Error {
  constructor(flag: string) {
    super(`Flag ${flag} is already defined for list`)
  }
}

export class NoArgDuplicateFlagForPrimitiveError extends Error {
  constructor(flag: string) {
    super(`Flag ${flag} is already defined for primitive`)
  }
}

export class NoArgSyntaxError extends Error {
  constructor(message: string) {
    super(message)
  }
}
