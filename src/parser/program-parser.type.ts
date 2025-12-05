import {
  ProgramArgConfig,
  ProgramFlagOptions,
  ProgramListArgConfig,
  ProgramOptionalArgConfig,
} from '@/types/options.type'

export type ProgramParserOptions = {
  name: string
  description: string | undefined

  /**
   * Subprograms are the child programs of the current program.
   */
  subPrograms: ProgramParserOptions[]

  /**
   * Primary arguments are the arguments that are required for the current program.
   */
  primaryArguments: ProgramArgConfig[]

  /**
   * Optional arguments are the arguments that are optional for the current program.
   */
  optionalArguments: ProgramOptionalArgConfig[]

  /**
   * List arguments are the arguments that are a list of values.
   */
  listArguments: ProgramListArgConfig[]

  /**
   * Flags are the flags that are available for the current program.
   */
  flags: Record<string, ProgramFlagOptions>

  /**
   * Trailing arguments are the arguments that are after all the other arguments.
   */
  trailingArguments: boolean
}
