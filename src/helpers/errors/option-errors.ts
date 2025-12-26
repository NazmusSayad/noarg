import { NoArgNodeError } from './client-errors'

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

export class NoArgDuplicateOptionValueError extends NoArgNodeError {
  constructor(index: number, option: string) {
    super(index, `Duplicate option value for ${option}`)
  }
}
