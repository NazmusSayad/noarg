import { NoArgNodeError } from './client-errors'

export class NoArgPrimaryArgumentError extends NoArgNodeError {
  constructor(index: number) {
    super(index, `Expected argument at index ${index} but received null`)
  }
}
