import { NoArgClientError, NoArgNodeError } from './client-errors'

export class NoArgPrimaryArgumentError extends NoArgClientError {
  constructor(expected: number, received: number) {
    super(`Expected ${expected} arguments but received ${received}`)
  }
}

export class NoArgUnknownArgumentError extends NoArgNodeError {
  constructor(index: number) {
    super(index, `Unexpected argument at index ${index}`)
  }
}
