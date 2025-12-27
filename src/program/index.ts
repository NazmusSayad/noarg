import { createArgument } from './create-argument'
import { createOption } from './create-option'
import { createProgram } from './create-program'

export const noarg = {
  program: createProgram,
  argument: createArgument,
  option: createOption,
}
