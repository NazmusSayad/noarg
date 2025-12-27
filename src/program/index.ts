import { createArgument } from './create-argument'
import { createOption } from './create-option'
import { createProgram } from './create-program'

export const noarg = {
  createProgram: createProgram,
  argument: createArgument,
  option: createOption,
}
